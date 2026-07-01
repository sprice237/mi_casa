import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MarkupToolbar } from './MarkupToolbar';
import { ColorPicker } from './ColorPicker/ColorPicker';
import { MarkupContextProvider, useMarkupContext } from './useMarkupContext';
import { flattenMarkup } from './util';
import { MarkupEditorCanvas } from './MarkupEditorCanvas';
import { TEXT_FONT_SIZE } from './font';
import { CanvasSize } from './types';

type ImageMarkupEditorProps = {
  imageUri: string;
  imageMimeType: string;
  onConfirm: (result: { uri: string; mimeType: string }) => void;
  onCancel: () => void;
};

export function ImageMarkupEditor(props: ImageMarkupEditorProps) {
  return (
    <MarkupContextProvider>
      <ImageMarkupEditorInner {...props} />
    </MarkupContextProvider>
  )
}

export function ImageMarkupEditorInner({ imageUri, onConfirm, onCancel }: ImageMarkupEditorProps) {
  const [canvasSize, setCanvasSize] = useState<CanvasSize | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isFlattening, setIsFlattening] = useState(false);
  const insets = useSafeAreaInsets();

  const {
    tool,
    setTool,
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
    items,
    canUndo,
    canRedo,
    undo,
    redo,
    commitDraftText
  } = useMarkupContext();


  const handleDone = async () => {
    if (!canvasSize) return;
    commitDraftText();
    setIsFlattening(true);
    try {
      const result = await flattenMarkup(imageUri, items, canvasSize.width, canvasSize.height);
      onConfirm(result);
    } catch (e) {
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setIsFlattening(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={false} onRequestClose={onCancel}>
      <SafeAreaProvider>
      <SafeAreaView style={styles.root}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable onPress={onCancel} style={styles.topBarButton}>
            <Text style={styles.topBarButtonText}>Cancel</Text>
          </Pressable>
          <Pressable onPress={handleDone} style={[styles.topBarButton, styles.doneButton]} disabled={isFlattening}>
            <Text style={[styles.topBarButtonText, styles.doneButtonText]}>
              {isFlattening ? 'Processing…' : 'Done'}
            </Text>
          </Pressable>
        </View>

        <MarkupEditorCanvas imageUri={imageUri} canvasSize={canvasSize} onCanvasSizeChange={setCanvasSize} />

        {/* Toolbar */}
        <MarkupToolbar
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          canUndo={canUndo}
          canRedo={canRedo}
          onToolChange={setTool}
          onColorChange={setColor}
          onStrokeWidthChange={setStrokeWidth}
          onUndo={undo}
          onRedo={redo}
          onOpenColorPicker={() => setShowColorPicker(true)}
        />
      </SafeAreaView>

      {showColorPicker && (
        <ColorPicker
          onConfirm={hex => {
            setColor(hex);
            setShowColorPicker(false);
          }}
          onCancel={() => setShowColorPicker(false)}
        />
      )}
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topBarButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  topBarButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: '#007AFF',
  },
  doneButtonText: {
    fontWeight: '600',
  },
  canvasContainer: {
    flex: 1,
  },
  draftInput: {
    position: 'absolute',
    fontSize: TEXT_FONT_SIZE,
    fontWeight: '700',
    backgroundColor: 'transparent',
    minWidth: 100,
    padding: 0,
  },
});
