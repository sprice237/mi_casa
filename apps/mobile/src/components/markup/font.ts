import {
  Platform,
} from 'react-native';
import {
  matchFont,
} from '@shopify/react-native-skia';

export const TEXT_FONT_SIZE = 24;
export const TEXT_HIT_RADIUS = 30;

const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
const fontStyle = {
  fontFamily,
  fontSize: TEXT_FONT_SIZE,
  fontStyle: "normal" as const,
  fontWeight: "normal" as const,
};
export const font = matchFont(fontStyle);
