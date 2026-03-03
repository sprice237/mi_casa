import { Dispatch } from 'react';
import { Text } from 'react-native';
import { OptionPicker } from './OptionPicker';

export const predefinedEndpoints = [
  { label: 'AWS', value: 'https://rctrnsnrimtuuomvpnfrp7tedm0zjicv.lambda-url.us-east-1.on.aws/graphql' },
  { label: 'local', value: 'http://172.17.1.197:8080/graphql' }
] as const;
export type PredefinedEndpoint = (typeof predefinedEndpoints)[number];

type PredefinedEndpointSelectProps = {
  value: PredefinedEndpoint | null;
  onChange: Dispatch<PredefinedEndpointSelectProps['value']>;
}

export const PredefinedEndpointSelect = ({ value, onChange }: PredefinedEndpointSelectProps) => {
  return (
    <OptionPicker options={predefinedEndpoints} value={value} onChange={onChange} getKey={o => o.value} getLabel={o => o.label} emptyLabel='Custom'>
      {(selectedEndpoint) => <Text>{selectedEndpoint?.label ?? 'Custom'}</Text>}
    </OptionPicker>
  );
}