import { Dispatch, useMemo } from 'react';
import { Text } from 'react-native';
import { OptionPicker } from './OptionPicker';
import { useQuery } from '@apollo/client/react';
import { EquipmentFragmentDoc, EquipmentsDocument, getFragmentData } from '$/gql';

type EquipmentSelectProps = {
  value: string | null;
  onChange: Dispatch<EquipmentSelectProps['value']>;
}

export const EquipmentSelect = ({ value, onChange }: EquipmentSelectProps) => {
  const { data } = useQuery(EquipmentsDocument);
  const equipments = data?.equipments;

  const equipmentsById = useMemo(() => new Map(equipments?.map(equipment => getFragmentData(EquipmentFragmentDoc, equipment)).map(equipment => [equipment.id, equipment]) ?? []), [equipments]);
  const equipmentIds = useMemo(() => [...equipmentsById.keys()], [equipmentsById]);

  if (!equipments) {
    return <Text>Loading...</Text>;
  }

  return (
    <OptionPicker options={equipmentIds} value={value} onChange={onChange} getKey={o => o} getLabel={o => equipmentsById.get(o)?.name ?? 'Unknown'}>
      {(selectedEquipmentId) => <Text>{(selectedEquipmentId && equipmentsById.get(selectedEquipmentId)?.name) ?? '(None)'}</Text>}
    </OptionPicker>
  );
}