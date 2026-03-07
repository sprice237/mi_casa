import { getFragmentData, ProjectFragmentDoc, ProjectsDocument } from '$/gql';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { ProjectsListItem } from './ProjectsListItem';
import { Border } from './Border';
import { ProjectsListItemActions } from './ProjectsListItemActions';
import { AddTaskButton } from '../AddTaskButton';
import { useFlagState } from '$/util/util';
import { ProjectEditModal } from '../ProjectEditModal';

const ROW_HEIGHT = 60;

type ProjectsListProps = ComponentProps<typeof View>

export const ProjectsList = ({ ...props }: ProjectsListProps) => {
  const { value: isCreateModalVisible, setTrue: showCreateModal, setFalse: hideCreateModal } = useFlagState();
  const { data, refetch, loading } = useQuery(ProjectsDocument);
  const projects = data?.projects;


  return (
    <>
      {isCreateModalVisible && <ProjectEditModal onClose={hideCreateModal} />}
      <View {...props} style={[props.style, styles.container]}>
        <SwipeListView
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          refreshing={loading}
          onRefresh={refetch}
          data={projects}
          keyExtractor={(projectFragment) => getFragmentData(ProjectFragmentDoc, projectFragment).id}
          ItemSeparatorComponent={Border}
          renderItem={({ item: task }) => (
            <ProjectsListItem project={task} rowHeight={ROW_HEIGHT} />
          )}
          renderHiddenItem={({ item: project }, rowMap) => (
            <ProjectsListItemActions itemWidth={ROW_HEIGHT} project={project}
              onPress={() => rowMap[getFragmentData(ProjectFragmentDoc, project).id].closeRow()}
            />
          )}
          stopRightSwipe={-ROW_HEIGHT * ProjectsListItemActions.numRightButtons}
          rightOpenValue={-ROW_HEIGHT * ProjectsListItemActions.numRightButtons}
          ListEmptyComponent={() => <View><Text>Empty</Text></View>}
        />
        <AddTaskButton height={ROW_HEIGHT} label="Add new project" onPress={showCreateModal} />
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

