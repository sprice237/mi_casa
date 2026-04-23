
import {
  Path,
  Text as SkiaText,
} from '@shopify/react-native-skia';
import { MarkupItem } from './useMarkupState';
import { buildSkiaPath } from './util';
import { font } from './font';

type MarkupEditorCanvasItemProps = {
  item: MarkupItem;
};

export function MarkupEditorCanvasItem({ item }: MarkupEditorCanvasItemProps) {
  switch (item.type) {
    case 'path': {
      const path = buildSkiaPath(item.points);
      if (!path) {
        return null;
      }

      return (
        <Path
          path={path}
          color={item.color}
          style="stroke"
          strokeWidth={item.strokeWidth}
          strokeCap="round"
          strokeJoin="round"
          antiAlias
        />
      );
    }

    case 'text': {
      return (
        <SkiaText
          x={item.x}
          y={item.y}
          text={item.text}
          font={font}
          color={item.color}
        />
      );
    }
  }

}
