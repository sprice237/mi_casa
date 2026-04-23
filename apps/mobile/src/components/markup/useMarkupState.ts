import { useCallback, useState } from 'react';

export type MarkupPath = {
  type: 'path';
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
};

export type MarkupText = {
  type: 'text';
  text: string;
  x: number;
  y: number;
  color: string;
};

export type MarkupItem = MarkupPath | MarkupText;

export function useMarkupState() {
  const [items, setItems] = useState<MarkupItem[]>([]);
  const [redoStack, setRedoStack] = useState<MarkupItem[]>([]);
  const [activePath, setActivePath] = useState<MarkupPath | null>(null);

  const beginStroke = useCallback((x: number, y: number, color: string, strokeWidth: number) => {
    setActivePath({ type: 'path', points: [{ x, y }], color, strokeWidth });
  }, []);

  const extendStroke = useCallback((x: number, y: number) => {
    setActivePath(prev => {
      if (!prev) return prev;
      return { ...prev, points: [...prev.points, { x, y }] };
    });
  }, []);

  const commitStroke = useCallback(() => {
    setActivePath(prev => {
      if (!prev || prev.points.length < 2) return null;
      setItems(items => [...items, prev]);
      setRedoStack([]);
      return null;
    });
  }, []);

  const addItem = useCallback((item: MarkupItem) => {
    setItems(prev => [...prev, item]);
    setRedoStack([]);
  }, []);

  const undo = useCallback(() => {
    setItems(prev => {
      if (prev.length === 0) {
        return prev;
      };

      const last = prev[prev.length - 1];
      setRedoStack(rs => [...rs, last]);
      return prev.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack(prev => {
      if (prev.length === 0) {
        return prev;
      };

      const last = prev[prev.length - 1];
      setItems(items => [...items, last]);
      return prev.slice(0, -1);
    });
  }, []);

  const updateTextPosition = useCallback((index: number, x: number, y: number) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== index || item.type !== 'text') return item;
      return { ...item, x, y };
    }));
  }, []);

  return {
    items,
    activePath,
    canUndo: items.length > 0,
    canRedo: redoStack.length > 0,
    addItem,
    undo,
    redo,
    beginStroke,
    extendStroke,
    commitStroke,
    updateTextPosition,
  };
}
