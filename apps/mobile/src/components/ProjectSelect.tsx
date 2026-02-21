import { Dispatch, useMemo } from 'react';
import { Text } from 'react-native';
import { OptionPicker } from './OptionPicker';
import { useQuery } from '@apollo/client/react';
import { ProjectFragmentDoc, ProjectsDocument, getFragmentData } from '$/gql';

type ProjectSelectProps = {
  value: string | null;
  onChange: Dispatch<ProjectSelectProps['value']>;
}

export const ProjectSelect = ({ value, onChange }: ProjectSelectProps) => {
  const { data } = useQuery(ProjectsDocument);
  const projects = data?.projects;

  const projectsById = useMemo(() => new Map(projects?.map(project => getFragmentData(ProjectFragmentDoc, project)).map(project => [project.id, project]) ?? []), [projects]);
  const projectIds = useMemo(() => [...projectsById.keys()], [projectsById]);

  if (!projects) {
    return <Text>Loading...</Text>;
  }

  return (
    <OptionPicker options={projectIds} value={value} onChange={onChange} getKey={o => o} getLabel={o => projectsById.get(o)?.name ?? 'Unknown'}>
      {(selectedProjectId) => <Text>{(selectedProjectId && projectsById.get(selectedProjectId)?.name) ?? '(None)'}</Text>}
    </OptionPicker>
  );
}