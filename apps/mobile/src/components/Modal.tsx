import { DispatchWithoutAction, ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import RNModal from 'react-native-modal'
import AntDesign from '@expo/vector-icons/AntDesign';
import { DismissKeyboardAvoidingView } from '$/util';

type ModalProps = {
  title?: string;
  backdropClose?: boolean;
  hideHeader?: boolean;
  content: ReactNode;
  onClose: DispatchWithoutAction;
  bodyStyle?: StyleProp<ViewStyle>
}

export const Modal = ({ title, backdropClose, hideHeader, content, onClose, bodyStyle }: ModalProps) => {
  return (
    <RNModal isVisible onDismiss={onClose} {...backdropClose ? { onBackdropPress: onClose } : {}}>
      <DismissKeyboardAvoidingView style={styles.container}>
        {!hideHeader && (
          <View style={styles.header}>
            <View style={{ width: 20 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ textAlign: 'center' }}>{title}</Text>
            </View>
            <View style={{ width: 20 }}>
              <Pressable onPress={onClose}>
                <AntDesign name="close" size={20} />
              </Pressable>
            </View>
          </View>
        )}
        <View style={[styles.body, bodyStyle]}>
          {content}
        </View>
      </DismissKeyboardAvoidingView>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#cccF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  body: {
    padding: 12,
  }
});
