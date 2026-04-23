import {
  Canvas,
  Image as SkiaImage,
  useImage,
} from '@shopify/react-native-skia';
import { MarkupItem, MarkupPath } from './useMarkupState';
import { fitRect } from './util';
import { MarkupEditorCanvasItem } from './MarkupEditorCanvasItem';
import { MarkupEditorCanvasActivePath } from './MarkupEditorCanvasActivePath';

type MarkupEditorCanvasProps = {
  imageUri: string;
  height: number;
  width: number;
  items: MarkupItem[];
  activePath: MarkupPath | null;
};

export function MarkupEditorCanvas({ imageUri, height, width, items, activePath }: MarkupEditorCanvasProps) {
  const skImage = useImage(imageUri);

  // Compute image fit rect within canvas
  const imageRect = skImage
    ? fitRect(skImage.width(), skImage.height(), width, height)
    : null;

  return (
    <Canvas style={{ width, height }}>
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
  );
}
