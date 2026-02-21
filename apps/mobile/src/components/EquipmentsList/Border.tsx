import { StyleSheet, View } from 'react-native';

export const Border = () => {
  return (<View style={styles.border}></View>)
}

const styles = StyleSheet.create({
  border: {
    width: '100%',
    height: 0,
    borderBottomWidth: 1
  }
});


