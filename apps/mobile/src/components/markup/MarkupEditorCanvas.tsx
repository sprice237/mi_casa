import {
  Canvas,
  Image as SkiaImage,
  useImage,
} from '@shopify/react-native-skia';
import { MarkupText, useMarkupContext } from './useMarkupContext';
import { fitRect } from './util';
import { MarkupEditorCanvasItem } from './MarkupEditorCanvasItem';
import { MarkupEditorCanvasActivePath } from './MarkupEditorCanvasActivePath';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { StyleSheet, TextInput, View } from 'react-native';
import { CanvasSize } from './types';
import { TEXT_FONT_SIZE, TEXT_HIT_RADIUS } from './font';
import { useRef } from 'react';

type MarkupEditorCanvasProps = {
  imageUri: string;
  canvasSize: CanvasSize | null;
  onCanvasSizeChange: (size: CanvasSize) => void;
};

export function MarkupEditorCanvas({ imageUri, canvasSize, onCanvasSizeChange }: MarkupEditorCanvasProps) {
  const skImage = useImage(imageUri);

  const {
    tool,
    color,
    strokeWidth,
    items,
    activePath,
    beginStroke,
    extendStroke,
    commitStroke,
    updateTextPosition,
    draftText,
    setDraftText,
    commitDraftText,
  } = useMarkupContext();


  const drawGesture = Gesture.Pan()
    .minDistance(0)
    .onStart(e => {
      beginStroke({ point: { x: e.x, y: e.y }, color, strokeWidth });
    })
    .onUpdate(e => {
      extendStroke({ x: e.x, y: e.y });
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
        const dx = item.point.x - e.x;
        const dy = item.point.y - e.y;
        return Math.sqrt(dx * dx + dy * dy) < TEXT_HIT_RADIUS;
      });
      if (hitIndex >= 0) {
        // Start drag — handled by textDragGesture
        return;
      }
      // Place new text input
      setDraftText({ point: { x: e.x, y: e.y }, color, value: '' });
    })
    .runOnJS(true);

  const draggingTextRef = useRef<{ index: number; startX: number; startY: number } | null>(null);

  const textDragGesture = Gesture.Pan()
    .onStart(e => {
      const hitIndex = items.filter(item => item.type === 'text').findLastIndex(item => {
        const dx = item.point.x - e.x;
        const dy = item.point.y - e.y;
        return Math.sqrt(dx * dx + dy * dy) < TEXT_HIT_RADIUS;
      });
      if (hitIndex >= 0) {
        const item = items[hitIndex] as MarkupText;
        draggingTextRef.current = { index: hitIndex, startX: item.point.x - e.x, startY: item.point.y - e.y };
      }
    })
    .onUpdate(e => {
      if (!draggingTextRef.current) return;
      const { index, startX, startY } = draggingTextRef.current;
      updateTextPosition({ index, point: { x: e.x + startX, y: e.y + startY } });
    })
    .onEnd(() => {
      draggingTextRef.current = null;
    })
    .runOnJS(true);

  const canvasGesture = tool === 'draw'
    ? drawGesture
    : Gesture.Race(textDragGesture, textGesture);

  // Compute image fit rect within canvas
  const imageRect = skImage && canvasSize
    ? fitRect(skImage.width(), skImage.height(), canvasSize.width, canvasSize.height)
    : null;

  return (
    <GestureDetector gesture={canvasGesture}>
      <View
        style={styles.canvasContainer}
        onLayout={e => {
          const { width, height } = e.nativeEvent.layout;
          onCanvasSizeChange({ width, height });
        }}
      >
        {canvasSize && (
          <Canvas style={{ width: canvasSize.width, height: canvasSize.height }}>
            {/* Background image */}
            {skImage && imageRect && (
              <SkiaImage
                image={skImage}
                x={imageRect.x}
                y={imageRect.y}
                width={imageRect.width}
                height={imageRect.height}
                fit="contain"
              />
            )}

            {/* Committed items */}
            {items.map((item, i) => <MarkupEditorCanvasItem key={i} item={item} />)}

            {/* Active stroke */}
            {activePath && <MarkupEditorCanvasActivePath activePath={activePath} />}
          </Canvas>
        )}

        {/* Floating text input */}
        {draftText && (
          <TextInput
            autoFocus
            style={[
              styles.draftInput,
              { top: draftText.point.y - TEXT_FONT_SIZE, left: draftText.point.x, color: draftText.color },
            ]}
            value={draftText.value}
            onChangeText={text => setDraftText({ ...draftText, value: text })}
            onSubmitEditing={commitDraftText}
            returnKeyType="done"
            blurOnSubmit
          />
        )}
      </View>
    </GestureDetector>

  )
}

const styles = StyleSheet.create({
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