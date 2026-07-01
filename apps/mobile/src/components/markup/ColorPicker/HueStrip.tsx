import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { hueToRgb } from './util';

const HUE_STRIP_HEIGHT = 24;
const SV_SIZE = 260;

const HUE_STOPS = Array.from({ length: 7 }, (_, i) => hueToRgb((i / 6) * 360)) as [string, string, ...string[]];

type HueStripProps = {
  onHueChange: (hue: number) => void;
};

export function HueStrip({ onHueChange }: HueStripProps) {
  const [hueCursor, setHueCursor] = useState(0);

  const hueGesture = Gesture.Pan()
    .onUpdate(e => {
      const x = Math.max(0, Math.min(SV_SIZE, e.x));
      const newHue = (x / SV_SIZE) * 360;
      setHueCursor(x);
      onHueChange(newHue);
    })
    .runOnJS(true);

  const tapHueGesture = Gesture.Tap()
    .onEnd(e => {
      const x = Math.max(0, Math.min(SV_SIZE, e.x));
      const newHue = (x / SV_SIZE) * 360;
      setHueCursor(x);
      onHueChange(newHue);
    })
    .runOnJS(true);


  return (
    <GestureDetector gesture={Gesture.Race(hueGesture, tapHueGesture)}>
      <View style={styles.hueWrapper}>
        <Canvas style={{ width: SV_SIZE, height: HUE_STRIP_HEIGHT }}>
          <Rect x={0} y={0} width={SV_SIZE} height={HUE_STRIP_HEIGHT}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(SV_SIZE, 0)}
              colors={HUE_STOPS}
            />
          </Rect>
        </Canvas>
        {/* Hue cursor */}
        <View
          style={[
            styles.hueCursor,
            { left: hueCursor - 8 },
          ]}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  hueWrapper: {
    width: SV_SIZE,
    height: HUE_STRIP_HEIGHT,
  },
  hueCursor: {
    position: 'absolute',
    top: 0,
    width: 16,
    height: HUE_STRIP_HEIGHT,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
});
