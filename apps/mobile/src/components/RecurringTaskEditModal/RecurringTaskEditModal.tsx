import { RecurringTaskRule } from '@mi_casa/common';
import { DispatchWithoutAction, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Modal } from '../Modal';
import { StyledTextInput } from '../StyledTextInput';
import { CreateRecurringTaskDocument, UpdateRecurringTaskDocument, FragmentType, getFragmentData, RecurringTaskFragmentDoc } from '$/gql';
import { useMutation } from '@apollo/client/react';
import { OptionPicker } from '../OptionPicker';
import { DayFields } from './DayFields';
import { WeekFields } from './WeekFields';
import { MonthDomFields } from './MonthDomFields';
import { MonthDowFields } from './MonthDowFields';
import { YearFields } from './YearFields';
import { EquipmentSelect } from '../EquipmentSelect';
import { ProjectSelect } from '../ProjectSelect';

type RuleType = 'day' | 'week' | 'month_dom' | 'month_dow' | 'year';

const ruleTypeOptions: RuleType[] = ['day', 'week', 'month_dom', 'month_dow', 'year'];

type RecurringTaskEditModalProps = {
  recurringTask?: FragmentType<typeof RecurringTaskFragmentDoc>;
  onClose: DispatchWithoutAction;
}

export const RecurringTaskEditModal = ({ recurringTask: recurringTaskFragment, onClose }: RecurringTaskEditModalProps) => {
  const recurringTask = getFragmentData(RecurringTaskFragmentDoc, recurringTaskFragment);

  const [name, setName] = useState(recurringTask?.name ?? '');
  const [equipmentId, setEquipmentId] = useState<string | null>(recurringTask?.equipment?.id ?? null);
  const [projectId, setProjectId] = useState<string | null>(recurringTask?.project?.id ?? null);
  const [rule, setRule] = useState<RecurringTaskRule>(recurringTask?.rule as RecurringTaskRule ?? { type: 'day', interval: 1 });

  const setRuleType = (newRuleType: RuleType) => {
    if (newRuleType === rule.type) {
      return;
    }

    switch (newRuleType) {
      case 'day':
        setRule({ type: 'day', interval: 1 });
        break;
      case 'week':
        setRule({ type: 'week', interval: 1, dow: [] });
        break;
      case 'month_dom':
        setRule({ type: 'month_dom', interval: 1, dom: 1 });
        break;
      case 'month_dow':
        setRule({ type: 'month_dow', interval: 1, dow: 0, wom: 1 });
        break;
      case 'year':
        setRule({ type: 'year', interval: 1, month: 1, dom: 1 });
        break;
    }
  }

  const [createTask] = useMutation(CreateRecurringTaskDocument);
  const [updateTask] = useMutation(UpdateRecurringTaskDocument);

  const doAddRecurringTask = async () => {
    if (recurringTask) {

      await updateTask({
        variables: {
          recurringTaskId: recurringTask.id,
          input: {
            name,
            rule,
            equipmentId: { id: equipmentId },
            projectId: { id: projectId },
            startDate: null,
          }
        },
      });
    } else {
      await createTask({
        variables: {
          input: {
            name,
            rule,
            equipmentId,
            projectId,
            startDate: new Date(),
          }
        },
        update(cache) {
          cache.evict({ fieldName: 'recurringTasks' })
        }
      });

    }
  }

  const onSubmit = async () => {
    await doAddRecurringTask();
    onClose();
  }

  return (
    <Modal backdropClose title="Add recurring task" onClose={onClose} content={(
      <View style={styles.container}>
        <StyledTextInput value={name} onChangeText={setName} placeholder="Name" />
        <View style={styles.row}>
          <Text>Equipment</Text>
          <View style={styles.flexOne}>
            <EquipmentSelect value={equipmentId} onChange={setEquipmentId} />
          </View>
        </View>
        <ProjectSelect value={equipmentId} onChange={setEquipmentId} />
        <View style={styles.row}>
          <Text>Project</Text>
          <View style={styles.flexOne}>
            <ProjectSelect value={equipmentId} onChange={setProjectId} />
          </View>
        </View>
        <View style={styles.row}>
          <Text>Type</Text>
          <OptionPicker options={ruleTypeOptions} value={rule.type}
            onChange={x => { if (x) { setRuleType(x) } }}
            getKey={option => option}

            getLabel={option => option}
          >
            {option => <Text>{option}</Text>}
          </OptionPicker>
        </View>
        {rule.type === 'day' && <DayFields rule={rule} onChange={setRule} />}
        {rule.type === 'week' && <WeekFields rule={rule} onChange={setRule} />}
        {rule.type === 'month_dom' && <MonthDomFields rule={rule} onChange={setRule} />}
        {rule.type === 'month_dow' && <MonthDowFields rule={rule} onChange={setRule} />}
        {rule.type === 'year' && <YearFields rule={rule} onChange={setRule} />}
        <Button onPress={onSubmit} title="Submit" />
      </View>
    )} />
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    gap: 10
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flexOne: {
    flex: 1
  }
})