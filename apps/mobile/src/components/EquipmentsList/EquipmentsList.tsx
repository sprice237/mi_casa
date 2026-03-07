import { getFragmentData, EquipmentFragmentDoc, EquipmentsDocument, FragmentType } from '$/gql';
import { ComponentProps, Dispatch } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { EquipmentsListItem } from './EquipmentsListItem';
import { Border } from './Border';
import { EquipmentsListItemActions } from './EquipmentsListItemActions';
import { AddTaskButton } from '../AddTaskButton';
import { useFlagState } from '$/util/util';
import { EquipmentEditModal } from '../EquipmentEditModal';

const ROW_HEIGHT = 60;

type EquipmentsListProps = ComponentProps<typeof View> & {
  onEquipmentPress?: Dispatch<FragmentType<typeof EquipmentFragmentDoc>>
}

export const EquipmentsList = ({ onEquipmentPress, ...viewProps }: EquipmentsListProps) => {
  const { value: isCreateModalVisible, setTrue: showCreateModal, setFalse: hideCreateModal } = useFlagState();
  const { data, refetch, loading } = useQuery(EquipmentsDocument);
  const equipments = data?.equipments;


  return (
    <>
      {isCreateModalVisible && <EquipmentEditModal onClose={hideCreateModal} />}
      <View {...viewProps} style={[viewProps.style, styles.container]}>
        <SwipeListView
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          refreshing={loading}
          onRefresh={refetch}
          data={equipments}
          keyExtractor={(equipmentFragment) => getFragmentData(EquipmentFragmentDoc, equipmentFragment).id}
          ItemSeparatorComponent={Border}
          renderItem={({ item: equipment }) => onEquipmentPress ? (
            <Pressable onPress={() => onEquipmentPress(equipment)}>
              <EquipmentsListItem equipment={equipment} rowHeight={ROW_HEIGHT} />
            </Pressable>
          ) : <EquipmentsListItem equipment={equipment} rowHeight={ROW_HEIGHT} />
          }
          renderHiddenItem={({ item: equipment }, rowMap) => (
            <EquipmentsListItemActions itemWidth={ROW_HEIGHT} equipment={equipment}
              onPress={() => rowMap[getFragmentData(EquipmentFragmentDoc, equipment).id].closeRow()}
            />
          )}
          stopRightSwipe={-ROW_HEIGHT * EquipmentsListItemActions.numRightButtons}
          rightOpenValue={-ROW_HEIGHT * EquipmentsListItemActions.numRightButtons}
          ListEmptyComponent={() => <View><Text>Empty</Text></View>}
        />
        <AddTaskButton height={ROW_HEIGHT} label="Add new equipment" onPress={showCreateModal} />
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

