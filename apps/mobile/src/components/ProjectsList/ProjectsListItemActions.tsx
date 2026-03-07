import { StyleSheet, View } from 'react-native';
import { DeleteButton } from '../DeleteButton';
import { EditButton } from '../EditButton';
import { FragmentType, getFragmentData, DeleteProjectDocument, ProjectFragmentDoc } from '$/gql';
import { useMutation } from '@apollo/client/react';
import { Dispatch } from 'react';
import { useFlagState } from '$/util/util';
import { ProjectEditModal } from '../ProjectEditModal';

type ProjectsListItemActionsProps = {
  itemWidth: number;
  project: FragmentType<typeof ProjectFragmentDoc>;
  onPress: Dispatch<void>
};

export const ProjectsListItemActions = ({ itemWidth, project: projectFragment, onPress }: ProjectsListItemActionsProps) => {
  const { value: isEditModalVisible, setTrue: showEditModal, setFalse: hideEditModal } = useFlagState();
  const project = getFragmentData(ProjectFragmentDoc, projectFragment);

  const [deleteProject] = useMutation(DeleteProjectDocument);

  const doDeleteTask = () => {
    onPress();
    deleteProject({
      variables: {
        projectId: project.id,
      },
      update(cache) {
        cache.evict({ fieldName: 'projects' })
      }
    })
  }

  return (
    <>
      {isEditModalVisible && <ProjectEditModal project={projectFragment} onClose={hideEditModal} />}
      <View style={styles.container}>
        <View style={styles.actionsContainer}>
          <EditButton height="100%" onPress={showEditModal} width={itemWidth} />
          <DeleteButton height="100%" onPress={doDeleteTask} width={itemWidth} />
        </View>
      </View>
    </>
  );
}

ProjectsListItemActions.numLeftButtons = 1;
ProjectsListItemActions.numRightButtons = 2;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  actionsContainer: {
    display: 'flex', flexDirection: 'row'
  },
})