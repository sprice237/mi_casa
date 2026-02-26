import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { StyledTextInput } from '../StyledTextInput';
import { EquipmentSelect } from '../EquipmentSelect';
import { ProjectSelect } from '../ProjectSelect';
import { RecurringTaskRule } from '@mi_casa/common';
import { StyleSheet, Text, View } from 'react-native';
import { OptionPicker } from '../OptionPicker';
import { DayFields } from './DayFields';
import { WeekFields } from './WeekFields';
import { MonthDomFields } from './MonthDomFields';
import { MonthDowFields } from './MonthDowFields';
import { YearFields } from './YearFields';

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

export function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>()

  return (
    <StyledTextInput value={field.state.value} onChangeText={field.setValue} placeholder={label} />
  )
}

export function EquipmentSelectField() {
  const field = useFieldContext<string | null>()

  return (
    <EquipmentSelect value={field.state.value} onChange={e => field.setValue(e)} />
  )
}

export function ProjectSelectField() {
  const field = useFieldContext<string | null>()

  return (
    <ProjectSelect value={field.state.value} onChange={e => field.setValue(e)} />
  )
}

type RuleType = 'day' | 'week' | 'month_dom' | 'month_dow' | 'year';

const ruleTypeOptions: RuleType[] = ['day', 'week', 'month_dom', 'month_dow', 'year'];

const defaultRulesForType: Record<RuleType, RecurringTaskRule> = {
  day: { type: 'day', interval: 1 },
  week: { type: 'week', interval: 1, dow: [] },
  month_dom: { type: 'month_dom', interval: 1, dom: 1 },
  month_dow: { type: 'month_dow', interval: 1, dow: 0, wom: 1 },
  year: { type: 'year', interval: 1, month: 1, dom: 1 },
}

export function RuleField() {
  const field = useFieldContext<RecurringTaskRule>()

  return (
    <>
      <View style={styles.row}>
        <Text>Type</Text>
        <OptionPicker options={ruleTypeOptions} value={field.state.value.type}
          onChange={newType => { if (newType && newType !== field.state.value.type) { field.setValue(defaultRulesForType[newType]) } }}
          getKey={option => option}
          getLabel={option => option}
        >
          {option => <Text>{option}</Text>}
        </OptionPicker>
      </View>
      {field.state.value.type === 'day' && <DayFields rule={field.state.value} onChange={field.setValue} />}
      {field.state.value.type === 'week' && <WeekFields rule={field.state.value} onChange={field.setValue} />}
      {field.state.value.type === 'month_dom' && <MonthDomFields rule={field.state.value} onChange={field.setValue} />}
      {field.state.value.type === 'month_dow' && <MonthDowFields rule={field.state.value} onChange={field.setValue} />}
      {field.state.value.type === 'year' && <YearFields rule={field.state.value} onChange={field.setValue} />}
    </>
  )
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

export const { useAppForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    EquipmentSelectField,
    ProjectSelectField,
    RuleField,
    TextField
  },
  formComponents: {}
})

export const RuleSubForm = withFieldGroup({
  defaultValues: {
    rule: undefined as unknown as RecurringTaskRule
  },
  render: ({ group }) => {
    return (
      <group.Field
        name="rule"
        children={field => (
          <>
            {/* <group.AppField name="rule" children={field => <field.RuleField />} /> */}
            <View style={styles.row}>
              <Text>Type</Text>
              <OptionPicker options={ruleTypeOptions} value={field.state.value.type}
                onChange={newType => { if (newType && newType !== field.state.value.type) { field.setValue(defaultRulesForType[newType]) } }}
                getKey={option => option}
                getLabel={option => option}
              >
                {option => <Text>{option}</Text>}
              </OptionPicker>
            </View>
            {field.state.value.type === 'day' && <DayFields rule={field.state.value} onChange={field.setValue} />}
            {field.state.value.type === 'week' && <WeekFields rule={field.state.value} onChange={field.setValue} />}
            {field.state.value.type === 'month_dom' && <MonthDomFields rule={field.state.value} onChange={field.setValue} />}
            {field.state.value.type === 'month_dow' && <MonthDowFields rule={field.state.value} onChange={field.setValue} />}
            {field.state.value.type === 'year' && <YearFields rule={field.state.value} onChange={field.setValue} />}
          </>
        )}
      />
    )
  }
})