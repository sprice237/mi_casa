import { createContext, Dispatch, DispatchWithoutAction, ReactNode, useCallback, useContext, useState } from 'react';
import { Keyboard } from 'react-native';

export type Point = {
  x: number;
  y: number;
}

export type Tool = 'draw' | 'text';

export type MarkupPath = {
  type: 'path';
  points: Point[];
  color: string;
  strokeWidth: number;
};

export type MarkupText = {
  type: 'text';
  text: string;
  point: Point;
  color: string;
};

export type MarkupItem = MarkupPath | MarkupText;

type BeginStrokeProps = {
  point: Point;
  color: string;
  strokeWidth: number;
}

type UpdateTextPositionProps = {
  index: number;
  point: Point;
}

type DraftText = {
  point: Point;
  color: string;
  value: string;
}

export type MarkupContextType = {
  tool: Tool;
  setTool: Dispatch<Tool>,

  color: string;
  setColor: Dispatch<string>,

  strokeWidth: number;
  setStrokeWidth: Dispatch<number>,

  items: MarkupItem[],
  activePath: MarkupPath | null,
  addItem: Dispatch<MarkupItem>,

  canUndo: boolean,
  canRedo: boolean,
  undo: DispatchWithoutAction,
  redo: DispatchWithoutAction,

  beginStroke: Dispatch<BeginStrokeProps>,
  extendStroke: Dispatch<Point>,
  commitStroke: DispatchWithoutAction,
  updateTextPosition: Dispatch<UpdateTextPositionProps>,

  draftText: DraftText | null;
  setDraftText: Dispatch<DraftText | null>,
  commitDraftText: DispatchWithoutAction;
}

const MarkupContext = createContext<MarkupContextType | null>(null);

export const useMarkupContext = () => {
  const context = useContext(MarkupContext);
  if (!context) {
    throw new Error('useMarkupContext must be used within a MarkupContextProvider');
  }
  return context;
}

type MarkupContextProviderProps = {
  children: ReactNode;
}

export function MarkupContextProvider({ children }: MarkupContextProviderProps) {
  const [tool, setTool] = useState<Tool>('draw');
  const [color, setColor] = useState('#FF3B30');
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [items, setItems] = useState<MarkupItem[]>([]);
  const [redoStack, setRedoStack] = useState<MarkupItem[]>([]);
  const [activePath, setActivePath] = useState<MarkupPath | null>(null);
  const [draftText, setDraftText] = useState<DraftText | null>(null);

  const beginStroke = useCallback(({ point, color, strokeWidth }: BeginStrokeProps) => {
    setActivePath({ type: 'path', points: [point], color, strokeWidth });
  }, []);

  const extendStroke = useCallback((point: Point) => {
    setActivePath(prev => {
      if (!prev) return prev;
      return { ...prev, points: [...prev.points, point] };
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

  const updateTextPosition = useCallback(({ index, point }: UpdateTextPositionProps) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== index || item.type !== 'text') return item;
      return { ...item, point };
    }));
  }, []);

  const commitDraftText = useCallback(() => {
    if (!draftText || !draftText.value.trim()) {
      setDraftText(null);
      return;
    }
    addItem({ type: 'text', text: draftText.value.trim(), point: draftText.point, color: draftText.color });
    setDraftText(null);
    Keyboard.dismiss();
  }, [draftText]);

  const contextValue: MarkupContextType = {
    tool,
    setTool,
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
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
    draftText,
    setDraftText,
    commitDraftText
  };

  return (
    <MarkupContext.Provider value={contextValue} >
      {children}
    </MarkupContext.Provider>
  )
}
