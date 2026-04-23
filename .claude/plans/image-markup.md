Image Markup Editor
===================

Context
-------

Users of the mobile app can attach images to activity feed entries (via camera or photo library). The request is to add a Snapchat-style markup screen that intercepts each image before upload, letting users draw colored lines and place/drag text over the image. The markup is then flattened into the image pixels before upload.

* * * * *

Library Decision: react-native-skia
-----------------------------------

**react-native-svg (rejected):**

-   SVG re-renders its entire React tree on every finger move --- with many path points, this lags visibly on older devices
-   Flattening markup into a raster image requires adding `react-native-view-shot` (screenshot hack, can produce blurry output)
-   No native path smoothing

**react-native-skia (chosen):**

-   GPU-accelerated on a separate thread --- buttery smooth drawing regardless of JS load
-   `makeImageSnapshot()` renders image + markup layers directly to a pixel buffer --- no extra library needed to flatten
-   Undo/redo is trivially a splice of a path array; path objects are lightweight
-   Text positioning/rendering is first-class
-   Compatible with Expo SDK 54 managed workflow (no ejection)
-   Downside: ~3--4 MB added to binary; acceptable for a drawing feature

**Color picker:** Built with Skia's gradient fills (hue strip + SV square), avoiding a second new dependency.

* * * * *

New Dependency
--------------

```
npx expo install @shopify/react-native-skia

```

Already installed and required: `react-native-gesture-handler`, `react-native-reanimated`.

* * * * *

State Model
-----------

```
type MarkupPath = {
  type: 'path';
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
};

type MarkupText = {
  type: 'text';
  text: string;
  x: number;
  y: number;
  color: string;
};

type MarkupItem = MarkupPath | MarkupText;

```

Undo/redo stack:

-   `items: MarkupItem[]` --- committed items
-   `redoStack: MarkupItem[]` --- items available to redo
-   Any new draw/text action clears `redoStack`
-   Undo: pop last from `items`, push to `redoStack`
-   Redo: pop from `redoStack`, push to `items`
-   In-progress stroke (while finger is down) is held in separate `activePath` state and committed to `items` on finger lift

* * * * *

Files to Create
---------------

### `ImageMarkupEditor.tsx`

Full-screen overlay. Props:

```
{
  imageUri: string;
  imageMimeType: string;
  onConfirm: (result: { uri: string; mimeType: string }) => void;
  onCancel: () => void;
}

```

Layout:

```
┌──────────────────────────┐
│ [Cancel]          [Done] │  ← SafeAreaView top bar
│                          │
│   Image + Skia canvas    │  ← fills remaining space
│   (gesture responder)    │
│                          │
│ [Draw][Text][↩][↪]       │  ← bottom toolbar row 1
│ ● ● ● ● ● ● ● ● [+]     │  ← color palette row
│ ────────────── (slider)  │  ← stroke width (draw mode only)
└──────────────────────────┘

```

Behaviour:

-   **Draw mode** (default): Pan gesture tracks finger; builds `activePath` point-by-point, commits to `items` on end
-   **Text mode**: Tap gesture on canvas places a `TextInput` at tap coords; typing updates a draft text item; tapping "done" on keyboard commits to `items`; placed text items can be dragged (pan gesture on the text element before committing --- or by re-selecting it)
-   **Done**: calls `flattenMarkup(imageUri, items)` then `onConfirm` with the resulting URI
-   **Cancel**: calls `onCancel` (markup discarded, original image discarded)

### `useMarkupState.ts`

Custom hook encapsulating undo/redo logic:

```
export function useMarkupState() {
  // returns: items, activePath, redo stack counts, addItem, undo, redo,
  //          beginStroke, extendStroke, commitStroke
}

```

### `MarkupToolbar.tsx`

Bottom toolbar component. Props: active tool, color, strokeWidth, undo/redo availability, callbacks.

### `ColorPicker.tsx`

Full-screen modal. Contains:

-   Hue strip (Skia LinearGradient across 360°)
-   Saturation/Value square (Skia two-axis gradient)
-   Preview swatch + confirm/cancel buttons
-   Built entirely with Skia canvas + pan gestures --- no new library

* * * * *

Files to Modify
---------------

### `util.ts`

Add `flattenMarkup()` at the bottom:

```
export const flattenMarkup = async (
  imageUri: string,
  items: MarkupItem[],
  canvasWidth: number,
  canvasHeight: number
): Promise<string> => {
  // 1. Create Skia surface sized to original image dimensions
  // 2. Draw image onto surface
  // 3. Replay each MarkupItem (path or text) with its color/strokeWidth
  // 4. Call surface.makeImageSnapshot().encodeToBase64()
  // 5. Write to FileSystem.cacheDirectory temp file, return URI
}

```

Uses `@shopify/react-native-skia` Surface + `expo-file-system`.

### `CreateActivityFeedEntryModal.tsx`

Add `pendingMarkupAsset` state (`{ mimeType, uri } | null`).

Change image selection flow:

-   `handleCameraPress` / `handlePickImagePress`: instead of pushing directly to `imagePickerAssets`, set `pendingMarkupAsset`
-   Render `<ImageMarkupEditor>` when `pendingMarkupAsset` is set (as a full-screen overlay using RN `<Modal>`)
-   `onConfirm`: push flattened result to `imagePickerAssets`, clear `pendingMarkupAsset`
-   `onCancel`: clear `pendingMarkupAsset`

* * * * *

Integration Flow
----------------

```
launchCamera() / pickImage()
        │
        ▼
{ mimeType, uri }
        │
        ▼
pendingMarkupAsset state
        │
        ▼
<ImageMarkupEditor> (full-screen Modal)
        │
   ┌────┴────┐
 Done      Cancel
   │          │
   ▼          ▼
flattenMarkup()  clear pendingMarkupAsset
   │
   ▼
imagePickerAssets (existing upload flow unchanged)

```

* * * * *

Color Palette
-------------

8 fixed colors in the toolbar row: `['#FFFFFF', '#000000', '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#AF52DE']`

Plus a "+" button that opens `<ColorPicker>` modal for full HSV picker. Selected color from picker replaces active color.

Stroke width: horizontal slider (Reanimated `useSharedValue`) ranging 2--24px, shown only in draw mode.

* * * * *

Text Element Drag-to-Reposition UX
----------------------------------

1.  User switches to Text tool
2.  Tap anywhere on canvas → keyboard appears, `TextInput` floats at tap position
3.  User types; draft text renders on canvas in active color
4.  Press "Done" on keyboard → text item committed to `items` (undo stack)
5.  Committed text items rendered on canvas; tapping one enters drag mode (pan gesture repositions its x/y)
6.  Dragging a text item does not affect `items` until finger lifts (then `items` updated in-place, no undo entry --- repositioning is part of the same logical item)

* * * * *

Verification
------------

1.  `npx expo install @shopify/react-native-skia` completes without errors
2.  Launch app on iOS simulator; open activity feed; tap add entry
3.  **Camera / pick image** → markup editor appears full-screen
4.  **Draw**: touch and drag → colored line follows finger smoothly
5.  **Text**: switch to text tool → tap image → type → "Done" → text appears; drag to reposition
6.  **Undo/Redo**: multiple strokes → undo removes one at a time → redo restores them
7.  **Color palette**: tap each fixed color → strokes use that color; tap "+" → HSV picker → pick custom color → confirmed color used for next stroke
8.  **Stroke width**: drag slider → next stroke uses new width
9.  **Done**: resulting image shown in the 50×50 thumbnail in the modal; upload completes; attachment visible in feed
10. **Cancel**: returns to modal with no image added
11. **HEIC images**: HEIC → JPEG conversion still fires before markup editor opens (in `handleImagePickerResult`)