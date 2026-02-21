import { getFragmentData, EquipmentFragmentDoc, EquipmentsDocument } from '$/gql';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { EquipmentsListItem } from './EquipmentsListItem';
import { Border } from './Border';
import { EquipmentsListItemActions } from './EquipmentsListItemActions';
import { AddTaskButton } from '../AddTaskButton';
import { useFlagState } from '$/util';
import { EquipmentEditModal } from '../EquipmentEditModal';

const ROW_HEIGHT = 60;

type EquipmentsListProps = ComponentProps<typeof View>

export const EquipmentsList = ({ ...props }: EquipmentsListProps) => {
  const { value: isCreateModalVisible, setTrue: showCreateModal, setFalse: hideCreateModal } = useFlagState();
  const { data, refetch, loading } = useQuery(EquipmentsDocument);
  const equipments = data?.equipments;


  return (
    <>
      {isCreateModalVisible && <EquipmentEditModal onClose={hideCreateModal} />}
      <View {...props} style={[props.style, styles.container]}>
        <SwipeListView
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          refreshing={loading}
          onRefresh={refetch}
          data={equipments}
          keyExtractor={(equipmentFragment) => getFragmentData(EquipmentFragmentDoc, equipmentFragment).id}
          ItemSeparatorComponent={Border}
          renderItem={({ item: task }) => (
            <EquipmentsListItem equipment={task} rowHeight={ROW_HEIGHT} />
          )}
          renderHiddenItem={({ item: equipment }, rowMap) => (
            <EquipmentsListItemActions itemWidth={ROW_HEIGHT} equipment={equipment}
              onPress={() => rowMap[getFragmentData(EquipmentFragmentDoc, equipment).id].closeRow()}
            />
          )}
          stopRightSwipe={-ROW_HEIGHT * EquipmentsListItemActions.numRightButtons}
          rightOpenValue={-ROW_HEIGHT * EquipmentsListItemActions.numRightButtons}
          ListEmptyComponent={() => <View><Text>Empty</Text></View>}
        />
        <AddTaskButton height={ROW_HEIGHT} label="Add new recurring task" onPress={showCreateModal} />
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    // flex: 1,
    minHeight: '100%'
  },
  list: {
    flex: 1,
  }
});

