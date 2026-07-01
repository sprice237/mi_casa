import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { hsvToHex, hueToRgb } from './util';
import { HueStrip } from './HueStrip';

const SV_SIZE = 260;

type ColorPickerProps = {
  initialColor?: string;
  onConfirm: (hex: string) => void;
  onCancel: () => void;
};

export function ColorPicker({ initialColor, onConfirm, onCancel }: ColorPickerProps) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(1);
  const [value, setValue] = useState(1);
  const [svCursor, setSvCursor] = useState({ x: SV_SIZE, y: 0 });

  const previewColor = hsvToHex(hue, saturation, value);

  const svGesture = Gesture.Pan()
    .onUpdate(e => {
      const x = Math.max(0, Math.min(SV_SIZE, e.x));
      const y = Math.max(0, Math.min(SV_SIZE, e.y));
      setSvCursor({ x, y });
      setSaturation(x / SV_SIZE);
      setValue(1 - y / SV_SIZE);
    })
    .runOnJS(true);

  const tapSvGesture = Gesture.Tap()
    .onEnd(e => {
      const x = Math.max(0, Math.min(SV_SIZE, e.x));
      const y = Math.max(0, Math.min(SV_SIZE, e.y));
      setSvCursor({ x, y });
      setSaturation(x / SV_SIZE);
      setValue(1 - y / SV_SIZE);
    })
    .runOnJS(true);

  const hueColor = hueToRgb(hue);

  return (
    <Modal transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Pick a color</Text>

          {/* SV square */}
          <GestureDetector gesture={Gesture.Race(svGesture, tapSvGesture)}>
            <View style={styles.svWrapper}>
              <Canvas style={{ width: SV_SIZE, height: SV_SIZE }}>
                {/* Base: hue color → white (saturation) */}
                <Rect x={0} y={0} width={SV_SIZE} height={SV_SIZE}>
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(SV_SIZE, 0)}
                    colors={['#ffffff', hueColor]}
                  />
                </Rect>
                {/* Overlay: transparent → black (value) */}
                <Rect x={0} y={0} width={SV_SIZE} height={SV_SIZE}>
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, SV_SIZE)}
                    colors={['transparent', '#000000']}
                  />
                </Rect>
              </Canvas>
              {/* Cursor */}
              <View
                style={[
                  styles.cursor,
                  { left: svCursor.x - 10, top: svCursor.y - 10 },
                ]}
              />
            </View>
          </GestureDetector>

          <HueStrip onHueChange={setHue} />

          {/* Preview */}
          <View style={styles.previewRow}>
            <View style={[styles.preview, { backgroundColor: previewColor }]} />
            <Text style={styles.previewLabel}>{previewColor.toUpperCase()}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={() => onConfirm(previewColor)}>
              <Text style={styles.confirmText}>Use Color</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  svWrapper: {
    width: SV_SIZE,
    height: SV_SIZE,
  },
  cursor: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  previewLabel: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});
