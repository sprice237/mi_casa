import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, Text } from 'react-native';

type FullScreenLoaderProps = {
  message?: string;
}

export const FullScreenLoader = ({ message }: FullScreenLoaderProps) => {
  return (
    <Modal transparent={true} animationType="none">
      <View style={styles.overlay}>
        {/* The built-in spinner component */}
        <ActivityIndicator
          size="large"
          color="#0000ff" // Customize the color
          animating
        />
        {message && <Text>{message}</Text>}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire screen
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent background to block interaction
    alignItems: 'center',
    justifyContent: 'center',
  },
});