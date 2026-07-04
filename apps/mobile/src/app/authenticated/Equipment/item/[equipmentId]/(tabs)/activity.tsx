import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSuspenseQuery } from '@apollo/client/react';
import { EquipmentDocument, EquipmentFragmentDoc, getFragmentData } from '$/gql';
import { ActivityFeed } from '$/components/activityFeed/ActivityFeed';


export default function Equipment() {
  const { equipmentId } = useLocalSearchParams<'/authenticated/Equipment/item/[equipmentId]/(tabs)/activity'>();
  if (!equipmentId) {
    throw new Error('must have equipmentId')
  }

  const { data: { equipment: equipmentFragment } } = useSuspenseQuery(EquipmentDocument, { variables: { equipmentId } });
  const equipment = getFragmentData(EquipmentFragmentDoc, equipmentFragment);

  return (
    <View style={styles.container}>
      <ActivityFeed style={styles.flexOne} activityFeedId={equipment.activityFeedId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  flexOne: {
    flex: 1,
  },
  listContainer: {
    flex: 1
  },
});