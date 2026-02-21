import { DispatchWithoutAction, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { Modal } from '../Modal';
import { StyledTextInput } from '../StyledTextInput';
import { CreateProjectDocument, UpdateProjectDocument, FragmentType, getFragmentData, ProjectFragmentDoc } from '$/gql';
import { useMutation } from '@apollo/client/react';

type ProjectEditModalProps = {
  project?: FragmentType<typeof ProjectFragmentDoc>;
  onClose: DispatchWithoutAction;
}

export const ProjectEditModal = ({ project: projectFragment, onClose }: ProjectEditModalProps) => {
  const project = getFragmentData(ProjectFragmentDoc, projectFragment);

  const [name, setName] = useState(project?.name ?? '');

  const [createProject] = useMutation(CreateProjectDocument);
  const [updateProject] = useMutation(UpdateProjectDocument);

  const doAddProject = async () => {
    if (project) {

      await updateProject({
        variables: {
          projectId: project.id,
          input: {
            name,
          }
        },
      });
    } else {
      await createProject({
        variables: {
          input: {
            name,
          }
        },
        update(cache) {
          cache.evict({ fieldName: 'projects' })
        }
      });

    }
  }

  const onSubmit = async () => {
    await doAddProject();
    onClose();
  }

  return (
    <Modal backdropClose title="Add project" onClose={onClose} content={(
      <View style={styles.container}>
        <StyledTextInput value={name} onChangeText={setName} placeholder="Name" />
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
  }
})