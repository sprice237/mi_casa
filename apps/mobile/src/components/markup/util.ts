import { Skia, PaintStyle, StrokeCap, StrokeJoin, SkCanvas, ImageFormat } from '@shopify/react-native-skia';
import * as FileSystem from 'expo-file-system/legacy';
import type { MarkupItem } from './useMarkupContext';
import { font } from './font';

export const flattenMarkup = async (
  imageUri: string,
  items: MarkupItem[],
  canvasWidth: number,
  canvasHeight: number,
): Promise<{ uri: string; mimeType: string }> => {
  const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
  const data = Skia.Data.fromBase64(base64);
  const skImage = Skia.Image.MakeImageFromEncoded(data);

  if (!skImage) {
    throw new Error('Could not decode image for markup flattening');
  }

  const imgW = skImage.width();
  const imgH = skImage.height();

  const surface = Skia.Surface.Make(imgW, imgH);
  if (!surface) {
    throw new Error('Could not create Skia surface for markup flattening');
  }

  const canvas = surface.getCanvas();
  canvas.drawImage(skImage, 0, 0);

  const scaleX = imgW / canvasWidth;
  const scaleY = imgH / canvasHeight;

  for (const item of items) {
    applyMarkupItemToCanvas(canvas, item, scaleX, scaleY);
  }

  const snapshot = surface.makeImageSnapshot();
  const encoded = snapshot.encodeToBase64(ImageFormat.JPEG, 90);
  const outputUri = `${FileSystem.cacheDirectory}markup_${Date.now()}.jpg`;

  await FileSystem.writeAsStringAsync(outputUri, encoded, { encoding: FileSystem.EncodingType.Base64 });

  return { uri: outputUri, mimeType: 'image/jpeg' };
};

function applyMarkupItemToCanvas(canvas: SkCanvas, item: MarkupItem, scaleX: number, scaleY: number) {
  switch (item.type) {
    case 'path': {
      if (item.points.length < 2) {
        return;
      }

      const path = Skia.Path.Make();
      item.points.forEach((pt, i) => {
        if (i === 0) path.moveTo(pt.x * scaleX, pt.y * scaleY);
        else path.lineTo(pt.x * scaleX, pt.y * scaleY);
      });
      const paint = Skia.Paint();
      paint.setColor(Skia.Color(item.color));
      paint.setStrokeWidth(item.strokeWidth * Math.min(scaleX, scaleY));
      paint.setStyle(PaintStyle.Stroke);
      paint.setStrokeCap(StrokeCap.Round);
      paint.setStrokeJoin(StrokeJoin.Round);
      paint.setAntiAlias(true);
      canvas.drawPath(path, paint);
      break;
    }
    case 'text': {
      const paint = Skia.Paint();
      paint.setColor(Skia.Color(item.color));
      canvas.drawText(item.text, item.point.x * scaleX, item.point.y * scaleY, paint, font);
    }
  }
}

export function fitRect(imgW: number, imgH: number, canvasW: number, canvasH: number) {
  const scale = Math.min(canvasW / imgW, canvasH / imgH);
  const width = imgW * scale;
  const height = imgH * scale;
  return {
    x: (canvasW - width) / 2,
    y: (canvasH - height) / 2,
    width,
    height,
  };
}

// Build Skia path string from points
export function buildSkiaPath(points: { x: number; y: number }[]) {
  if (points.length < 2) {
    return null;
  }

  const path = Skia.Path.Make();
  points.forEach((pt, i) => {
    if (i === 0) path.moveTo(pt.x, pt.y);
    else path.lineTo(pt.x, pt.y);
  });
  return path;
};
