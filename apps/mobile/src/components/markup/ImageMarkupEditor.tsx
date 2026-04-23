import { useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MarkupToolbar } from './MarkupToolbar';
import { ColorPicker } from './ColorPicker';
import { useMarkupState, type MarkupText } from './useMarkupState';
import { flattenMarkup } from './util';
import { MarkupEditorCanvas } from './MarkupEditorCanvas';
import { TEXT_FONT_SIZE, TEXT_HIT_RADIUS } from './font';

type ImageMarkupEditorProps = {
  imageUri: string;
  imageMimeType: string;
  onConfirm: (result: { uri: string; mimeType: string }) => void;
  onCancel: () => void;
};

type CanvasSize = { width: number; height: number };

export function ImageMarkupEditor({ imageUri, onConfirm, onCancel }: ImageMarkupEditorProps) {
  const [tool, setTool] = useState<'draw' | 'text'>('draw');
  const [color, setColor] = useState('#FF3B30');
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [canvasSize, setCanvasSize] = useState<CanvasSize | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isFlattening, setIsFlattening] = useState(false);

  // Draft text input state
  const [draftText, setDraftText] = useState<{ x: number; y: number; color: string } | null>(null);
  const [draftValue, setDraftValue] = useState('');

  // Dragging committed text
  const draggingTextRef = useRef<{ index: number; startX: number; startY: number } | null>(null);

  const {
    items,
    activePath,
    canUndo,
    canRedo,
    addItem,
    undo,
    redo,
    beginStroke,
    extendStroke,
    commitStroke,
    updateTextPosition,
  } = useMarkupState();

  const drawGesture = Gesture.Pan()
    .minDistance(0)
    .onStart(e => {
      beginStroke(e.x, e.y, color, strokeWidth);
    })
    .onUpdate(e => {
      extendStroke(e.x, e.y);
    })
    .onEnd(() => {
      commitStroke();
    })
    .runOnJS(true);

  const textGesture = Gesture.Tap()
    .onEnd(e => {
      // Check if tapping near a committed text item
      const hitIndex = items.findLastIndex(item => {
        if (item.type !== 'text') return false;
        const dx = item.x - e.x;
        const dy = item.y - e.y;
        return Math.sqrt(dx * dx + dy * dy) < TEXT_HIT_RADIUS;
      });
      if (hitIndex >= 0) {
        // Start drag — handled by textDragGesture
        return;
      }
      // Place new text input
      setDraftText({ x: e.x, y: e.y, color });
      setDraftValue('');
    })
    .runOnJS(true);

  const textDragGesture = Gesture.Pan()
    .onStart(e => {
      const hitIndex = items.findLastIndex(item => {
        if (item.type !== 'text') return false;
        const dx = item.x - e.x;
        const dy = item.y - e.y;
        return Math.sqrt(dx * dx + dy * dy) < TEXT_HIT_RADIUS;
      });
      if (hitIndex >= 0) {
        const item = items[hitIndex] as MarkupText;
        draggingTextRef.current = { index: hitIndex, startX: item.x - e.x, startY: item.y - e.y };
      }
    })
    .onUpdate(e => {
      if (!draggingTextRef.current) return;
      const { index, startX, startY } = draggingTextRef.current;
      updateTextPosition(index, e.x + startX, e.y + startY);
    })
    .onEnd(() => {
      draggingTextRef.current = null;
    })
    .runOnJS(true);

  const canvasGesture = tool === 'draw'
    ? drawGesture
    : Gesture.Race(textDragGesture, textGesture);

  const commitDraftText = () => {
    if (!draftText || !draftValue.trim()) {
      setDraftText(null);
      return;
    }
    addItem({ type: 'text', text: draftValue.trim(), x: draftText.x, y: draftText.y, color: draftText.color });
    setDraftText(null);
    setDraftValue('');
    Keyboard.dismiss();
  };

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

        {/* Canvas */}
        <GestureDetector gesture={canvasGesture}>
          <View
            style={styles.canvasContainer}
            onLayout={e => {
              const { width, height } = e.nativeEvent.layout;
              setCanvasSize({ width, height });
            }}
          >
            {canvasSize && (
              <MarkupEditorCanvas imageUri={imageUri} height={canvasSize.height} width={canvasSize.width} items={items} activePath={activePath} />
            )}

            {/* Floating text input */}
            {draftText && (
              <TextInput
                autoFocus
                style={[
                  styles.draftInput,
                  { top: draftText.y - TEXT_FONT_SIZE, left: draftText.x, color: draftText.color },
                ]}
                value={draftValue}
                onChangeText={setDraftValue}
                onSubmitEditing={commitDraftText}
                returnKeyType="done"
                blurOnSubmit
              />
            )}
          </View>
        </GestureDetector>

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
