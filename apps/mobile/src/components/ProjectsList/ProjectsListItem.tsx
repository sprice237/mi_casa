import { FragmentType, getFragmentData, ProjectFragmentDoc } from '$/gql';
import { StyleSheet, Text, View } from 'react-native';

type ProjectsListItemProps = {
  project: FragmentType<typeof ProjectFragmentDoc>;
  rowHeight: number;
};

export const ProjectsListItem = ({ project: projectFragment, rowHeight }: ProjectsListItemProps) => {
  const project = getFragmentData(ProjectFragmentDoc, projectFragment)

  return (
    <View style={[styles.container, { height: rowHeight }]}>
      <View style={{ flex: 1 }}>
        <Text>{project.name}</Text>
      </View>
      <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
  },
  text: { margin: 6 }
});
