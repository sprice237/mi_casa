import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const PALETTE_COLORS = ['#FFFFFF', '#000000', '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#AF52DE'];
const SLIDER_MIN = 2;
const SLIDER_MAX = 24;
const SLIDER_TRACK_WIDTH = 200;

type MarkupToolbarProps = {
  tool: 'draw' | 'text';
  color: string;
  strokeWidth: number;
  canUndo: boolean;
  canRedo: boolean;
  onToolChange: (tool: 'draw' | 'text') => void;
  onColorChange: (color: string) => void;
  onStrokeWidthChange: (w: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onOpenColorPicker: () => void;
};

export function MarkupToolbar({
  tool,
  color,
  strokeWidth,
  canUndo,
  canRedo,
  onToolChange,
  onColorChange,
  onStrokeWidthChange,
  onUndo,
  onRedo,
  onOpenColorPicker,
}: MarkupToolbarProps) {
  const sliderX = useSharedValue(
    ((strokeWidth - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * SLIDER_TRACK_WIDTH
  );

  const onStrokeWidthChangeRef = useRef(onStrokeWidthChange);
  onStrokeWidthChangeRef.current = onStrokeWidthChange;

  const notifyStrokeWidth = (x: number) => {
    const clamped = Math.max(0, Math.min(SLIDER_TRACK_WIDTH, x));
    const w = SLIDER_MIN + (clamped / SLIDER_TRACK_WIDTH) * (SLIDER_MAX - SLIDER_MIN);
    onStrokeWidthChangeRef.current(Math.round(w));
  };

  const sliderGesture = Gesture.Pan()
    .onUpdate(e => {
      const clamped = Math.max(0, Math.min(SLIDER_TRACK_WIDTH, e.x));
      sliderX.value = clamped;
      runOnJS(notifyStrokeWidth)(clamped);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sliderX.value - 10 }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: sliderX.value,
  }));

  return (
    <View style={styles.container}>
      {/* Row 1: tool buttons */}
      <View style={styles.row}>
        <Pressable
          style={[styles.toolButton, tool === 'draw' && styles.toolButtonActive]}
          onPress={() => onToolChange('draw')}
        >
          <Text style={styles.toolButtonText}>Draw</Text>
        </Pressable>
        <Pressable
          style={[styles.toolButton, tool === 'text' && styles.toolButtonActive]}
          onPress={() => onToolChange('text')}
        >
          <Text style={styles.toolButtonText}>Text</Text>
        </Pressable>
        <Pressable
          style={[styles.toolButton, !canUndo && styles.toolButtonDisabled]}
          onPress={onUndo}
          disabled={!canUndo}
        >
          <Text style={styles.toolButtonText}>↩</Text>
        </Pressable>
        <Pressable
          style={[styles.toolButton, !canRedo && styles.toolButtonDisabled]}
          onPress={onRedo}
          disabled={!canRedo}
        >
          <Text style={styles.toolButtonText}>↪</Text>
        </Pressable>
      </View>

      {/* Row 2: color palette */}
      <View style={styles.row}>
        {PALETTE_COLORS.map(c => (
          <Pressable
            key={c}
            onPress={() => onColorChange(c)}
            style={[
              styles.swatch,
              { backgroundColor: c },
              color === c && styles.swatchSelected,
            ]}
          />
        ))}
        <Pressable style={styles.pickerButton} onPress={onOpenColorPicker}>
          <Text style={styles.pickerButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Row 3: stroke width slider (draw mode only) */}
      {tool === 'draw' && (
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>{strokeWidth}px</Text>
          <GestureDetector gesture={sliderGesture}>
            <View style={[styles.sliderTrack, { width: SLIDER_TRACK_WIDTH }]}>
              <Animated.View style={[styles.sliderFill, fillStyle]} />
              <Animated.View style={[styles.sliderThumb, thumbStyle]} />
            </View>
          </GestureDetector>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  toolButtonActive: {
    backgroundColor: '#007AFF',
  },
  toolButtonDisabled: {
    opacity: 0.35,
  },
  toolButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  swatch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  pickerButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerButtonText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 22,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderLabel: {
    color: '#fff',
    fontSize: 12,
    width: 36,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
    justifyContent: 'center',
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    top: -8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});
