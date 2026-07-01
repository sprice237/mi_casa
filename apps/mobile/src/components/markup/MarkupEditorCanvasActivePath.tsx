import {
  Path,
} from '@shopify/react-native-skia';
import { MarkupPath } from './useMarkupContext';
import { buildSkiaPath } from './util';

type MarkupEditorCanvasProps = {
  activePath: MarkupPath;
};

export function MarkupEditorCanvasActivePath({ activePath }: MarkupEditorCanvasProps) {
  const path = buildSkiaPath(activePath.points);

  if (!path) {
    return null;
  }

  return (
    <Path
      path={path}
      color={activePath.color}
      style="stroke"
      strokeWidth={activePath.strokeWidth}
      strokeCap="round"
      strokeJoin="round"
      antiAlias
    />
  );
}
