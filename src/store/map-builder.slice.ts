import { DEFAULT_CATEGORIES } from '@/constants/maps';
import { ActionType } from '@/types/map/action';
import { AreaShapeData } from '@/types/map/area-shape';
import { Category } from '@/types/map/category';
import { SeatGroup } from '@/types/map/seat';
import { ShapeData } from '@/types/map/shape';
import { TextData } from '@/types/map/text';
import { TFile } from '@/types/map/uploadFile';
import {
  PayloadAction,
  createListenerMiddleware,
  createSlice,
  isAnyOf,
} from '@reduxjs/toolkit';
import { v4 } from 'uuid';

export type TSelected = {
  type: 'seat' | 'shape' | 'text' | 'image' | 'area-shape';
  id: string;
  seatGroup?: SeatGroup;
  isMultipleSeats?: boolean;
} | null;

export type TMapBuilder = {
  seatGroups: SeatGroup[];
  selectedSeatGroups: SeatGroup[];
  unselectedSeatGroups: SeatGroup[];
  shapes: ShapeData[];
  texts: TextData[];
  selected: TSelected;
  actionType: ActionType;
  groupSelected: TSelected[];
  isDragging: boolean;
  history: TMapBuilderHistory[];
  currentHistoryIndex: number;
  files: TFile[];
  triggerUpload: number;
  areaShapes: AreaShapeData[];
  currentRotation: number | null;
  categories: Category[];
  editingPreview?:
    | SeatGroup
    | ShapeData
    | TextData
    | AreaShapeData
    | TFile
    | null;
  copyingItem: TSelected | null;
};
type TMapBuilderHistory = Pick<
  TMapBuilder,
  'shapes' | 'texts' | 'files' | 'areaShapes' | 'seatGroups'
>;
const initialState: TMapBuilder = {
  seatGroups: [],
  selectedSeatGroups: [],
  unselectedSeatGroups: [],
  shapes: [],
  texts: [],
  selected: null,
  actionType: ActionType.Seat,
  groupSelected: [],
  isDragging: false,
  history: [],
  currentHistoryIndex: -1,
  triggerUpload: 0,
  files: [],
  areaShapes: [],
  currentRotation: null,
  categories: DEFAULT_CATEGORIES,
  editingPreview: null,
  copyingItem: null,
};

export const mapBuilder = createSlice({
  name: 'mapBuilder',
  initialState,
  reducers: {
    resetState: () => initialState,
    setSeatGroups: (state, action: PayloadAction<SeatGroup[]>) => {
      state.seatGroups = action.payload;
    },
    setSelectedSeatGroups: (state, action: PayloadAction<SeatGroup[]>) => {
      state.selectedSeatGroups = action.payload;
    },
    setUnselectedSeatGroups: (state, action: PayloadAction<SeatGroup[]>) => {
      state.unselectedSeatGroups = action.payload;
    },
    setShapes: (state, action: PayloadAction<ShapeData[]>) => {
      state.shapes = action.payload;
    },
    setTexts: (state, action: PayloadAction<TextData[]>) => {
      state.texts = action.payload;
    },
    setSelected: (state, action: PayloadAction<TSelected>) => {
      state.selected = action.payload;
    },
    setActionType: (state, action: PayloadAction<ActionType>) => {
      // reset all ghostSeat, groupSelected
      if (action.payload !== state.actionType) {
        state.selected = null;
        state.groupSelected = [];
      }
      state.actionType = action.payload;
    },
    setGroupSelected: (state, action: PayloadAction<TSelected[]>) => {
      state.groupSelected = action.payload;
    },
    addSeatGroup: (state, action: PayloadAction<SeatGroup[]>) => {
      state.seatGroups.push(...action.payload);
    },
    addShape: (state, action: PayloadAction<ShapeData>) => {
      state.shapes.push(action.payload);
    },
    addText: (state, action: PayloadAction<TextData>) => {
      state.texts.push(action.payload);
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    deleteSeatGroup: (state, action: PayloadAction<string>) => {
      state.seatGroups = state.seatGroups.filter(
        (seatGroup) => seatGroup.id !== action.payload,
      );
    },
    deleteShape: (state, action: PayloadAction<string>) => {
      state.shapes = state.shapes.filter(
        (shape) => shape.id !== action.payload,
      );
    },
    deleteText: (state, action: PayloadAction<string>) => {
      state.texts = state.texts.filter((text) => text.id !== action.payload);
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload,
      );
    },
    updateText: (state, action: PayloadAction<TextData>) => {
      state.texts = state.texts.map((text) =>
        text.id === action.payload.id ? action.payload : text,
      );
    },
    updateSeatGroup: (state, action: PayloadAction<SeatGroup>) => {
      const index = state.seatGroups.findIndex(
        (seatGroup) => seatGroup.id === action.payload.id,
      );
      if (index !== -1) {
        state.seatGroups[index] = action.payload;
      }
    },
    updateMultipleSeatGroups: (state, action: PayloadAction<SeatGroup[]>) => {
      const updateMap = new Map(
        action.payload.map((group) => [group.id, group]),
      );
      state.seatGroups = state.seatGroups.map((group) =>
        updateMap.has(group.id) ? updateMap.get(group.id)! : group,
      );
    },
    updateSeatGroupsBySelected: (state, action: PayloadAction<SeatGroup[]>) => {
      state.seatGroups = [...action.payload, ...state.unselectedSeatGroups];
    },
    updateShape: (state, action: PayloadAction<ShapeData>) => {
      state.shapes = state.shapes.map((shape) =>
        shape.id === action.payload.id ? action.payload : shape,
      );
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      state.categories = state.categories.map((category) =>
        category.id === action.payload.id ? action.payload : category,
      );
    },
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    triggerFileUpload: (state) => {
      state.triggerUpload += 1;
    },
    addFiles: (state, action: PayloadAction<TFile>) => {
      state.files = [...state.files, action.payload];
    },
    deleteFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter((file) => file.id !== action.payload);
    },
    updateFile: (state, action: PayloadAction<TFile>) => {
      state.files = state.files.map((file) =>
        file.id === action.payload.id ? action.payload : file,
      );
    },
    setAreaShapes: (state, action: PayloadAction<AreaShapeData[]>) => {
      state.areaShapes = action.payload;
    },
    addAreaShape: (state, action: PayloadAction<AreaShapeData>) => {
      state.areaShapes.push(action.payload);
    },
    updateAreaShape: (state, action: PayloadAction<AreaShapeData>) => {
      state.areaShapes = state.areaShapes.map((areaShape) =>
        areaShape.id === action.payload.id ? action.payload : areaShape,
      );
    },
    deleteAreaShape: (state, action: PayloadAction<string>) => {
      state.areaShapes = state.areaShapes.filter(
        (areaShape) => areaShape.id !== action.payload,
      );
    },
    undo: (state) => {
      if (state.currentHistoryIndex > 0) {
        state.currentHistoryIndex--;
        const previousState = state.history[state.currentHistoryIndex];
        state.shapes = previousState.shapes;
        state.texts = previousState.texts;
        state.files = previousState.files;
        state.areaShapes = previousState.areaShapes;
        state.seatGroups = previousState.seatGroups;
      } else {
        // If at the beginning of history, reset to initial state
        state.shapes = initialState.shapes;
        state.texts = initialState.texts;
        state.files = initialState.files;
        state.areaShapes = initialState.areaShapes;
        state.seatGroups = initialState.seatGroups;
      }
      state.editingPreview = null;
    },
    redo: (state) => {
      if (state.currentHistoryIndex < state.history.length - 1) {
        state.currentHistoryIndex++;
        const nextState = state.history[state.currentHistoryIndex];
        state.shapes = nextState.shapes;
        state.texts = nextState.texts;
        state.files = nextState.files;
        state.areaShapes = nextState.areaShapes;
        state.seatGroups = nextState.seatGroups;
      }
      state.editingPreview = null;
    },
    saveToHistory: (state) => {
      const newHistoryState: TMapBuilderHistory = {
        shapes: state.shapes,
        texts: state.texts,
        files: state.files,
        areaShapes: state.areaShapes,
        seatGroups: state.seatGroups,
      };

      // Remove future states if we're not at the end of history
      state.history = state.history.slice(0, state.currentHistoryIndex + 1);

      // Add current state to history
      state.history.push(newHistoryState);
      state.currentHistoryIndex++;
    },
    setCurrentRotation: (state, action: PayloadAction<number | null>) => {
      state.currentRotation = action.payload;
    },
    deleteSelectedItem: (state) => {
      if (state.selected?.type === 'seat') {
        state.seatGroups = state.seatGroups.filter(
          (seat) => seat.id !== state.selected?.id,
        );
      } else if (state.selected?.type === 'shape') {
        state.shapes = state.shapes.filter(
          (shape) => shape.id !== state.selected?.id,
        );
      } else if (state.selected?.type === 'text') {
        state.texts = state.texts.filter(
          (text) => text.id !== state.selected?.id,
        );
      } else if (state.selected?.type === 'area-shape') {
        state.areaShapes = state.areaShapes.filter(
          (areaShape) => areaShape.id !== state.selected?.id,
        );
      } else if (state.selected?.type === 'image') {
        state.files = state.files.filter(
          (file) => file.id !== state.selected?.id,
        );
      }
    },
    setEditingPreview: (
      state,
      action: PayloadAction<
        SeatGroup | ShapeData | TextData | AreaShapeData | TFile | null
      >,
    ) => {
      state.editingPreview = action.payload;
    },
    setEditingPreviewRotation: (
      state,
      action: PayloadAction<number | null>,
    ) => {
      if (state.editingPreview && !!action.payload) {
        (state.editingPreview as ShapeData).rotation = action.payload;
      }
    },
    duplicateSelectedItem: (state) => {
      if (!state.selected) return;

      const selectedItem = state.selected;

      const newId = v4();

      if (selectedItem.type === 'shape') {
        const shape = state.shapes.find(
          (shape) => shape.id === selectedItem.id,
        );

        if (shape) {
          if (shape.type === 'rect' || shape.type === 'ellipse') {
            state.shapes.push({
              ...shape,
              id: newId,
              x: shape.x + 20,
              y: shape.y + 20,
            });
          } else if (shape.type === 'polygon') {
            state.shapes.push({
              ...shape,
              id: newId,
              points: shape.points.map((point) => point + 20),
            });
          }
        }
      } else if (selectedItem.type === 'text') {
        const text = state.texts.find((text) => text.id === selectedItem.id);

        if (text) {
          state.texts.push({ ...text, id: newId });
        }
      } else if (selectedItem.type === 'area-shape') {
        const areaShape = state.areaShapes.find(
          (areaShape) => areaShape.id === selectedItem.id,
        );

        if (areaShape) {
          if (areaShape.type === 'rect' || areaShape.type === 'ellipse') {
            state.areaShapes.push({
              ...areaShape,
              id: newId,
              x: areaShape.x + 20,
              y: areaShape.y + 20,
            });
          } else if (areaShape.type === 'polygon') {
            state.areaShapes.push({
              ...areaShape,
              id: newId,
              points: areaShape.points.map((point) => point + 20),
            });
          }
        }
      } else if (selectedItem.type === 'image') {
        const file = state.files.find((file) => file.id === selectedItem.id);

        if (file) {
          state.files.push({ ...file, id: newId });
        }
      }

      state.selected = { ...selectedItem, id: newId };
    },
    setCopyingItem: (state, action: PayloadAction<TSelected | null>) => {
      state.copyingItem = action.payload;
    },
    pasteCopyingItem: (state) => {
      if (!state.copyingItem) return;

      const newId = v4();
      const offset = 20; // Offset for the pasted item position

      if (state.copyingItem.type === 'shape') {
        const shape = state.shapes.find(
          (shape) => shape.id === state.copyingItem?.id,
        );

        if (shape) {
          if (shape.type === 'rect' || shape.type === 'ellipse') {
            const newShape = {
              ...shape,
              id: newId,
              x: shape.x + offset,
              y: shape.y + offset,
            };
            state.shapes.push(newShape);
          } else if (shape.type === 'polygon') {
            const newShape = {
              ...shape,
              id: newId,
              points: shape.points.map((point) => point + offset),
            };
            state.shapes.push(newShape);
          }
          state.selected = { type: 'shape', id: newId };
        }
      } else if (state.copyingItem.type === 'text') {
        const text = state.texts.find(
          (text) => text.id === state.copyingItem?.id,
        );

        if (text) {
          const newText = {
            ...text,
            id: newId,
            x: text.x + offset,
            y: text.y + offset,
          };
          state.texts.push(newText);
          state.selected = { type: 'text', id: newId };
        }
      } else if (state.copyingItem.type === 'area-shape') {
        const areaShape = state.areaShapes.find(
          (areaShape) => areaShape.id === state.copyingItem?.id,
        );

        if (areaShape) {
          if (areaShape.type === 'rect' || areaShape.type === 'ellipse') {
            const newAreaShape = {
              ...areaShape,
              id: newId,
              x: areaShape.x + offset,
              y: areaShape.y + offset,
            };
            state.areaShapes.push(newAreaShape);
          } else if (areaShape.type === 'polygon') {
            const newAreaShape = {
              ...areaShape,
              id: newId,
              points: areaShape.points.map((point) => point + offset),
            };
            state.areaShapes.push(newAreaShape);
          }
          state.selected = { type: 'area-shape', id: newId };
        }
      } else if (state.copyingItem.type === 'image') {
        const file = state.files.find(
          (file) => file.id === state.copyingItem?.id,
        );

        if (file) {
          const newFile = {
            ...file,
            id: newId,
            x: file.x + offset,
            y: file.y + offset,
          };
          state.files.push(newFile);
          state.selected = { type: 'image', id: newId };
        }
      } else if (state.copyingItem.type === 'seat') {
        const seatGroup = state.seatGroups.find(
          (seatGroup) => seatGroup.id === state.copyingItem?.id,
        );

        if (seatGroup) {
          // Update each seat's position with the offset
          const updatedSeats = seatGroup.seats.map((seat) => ({
            ...seat,
            id: v4(), // Generate new IDs for each seat
            x: seat.x + offset,
            y: seat.y + offset,
          }));

          // Create new seat group with updated seats and bounds
          const newSeatGroup = {
            ...seatGroup,
            id: newId,
            seats: updatedSeats,
            bounds: {
              minX: seatGroup.bounds.minX + offset,
              maxX: seatGroup.bounds.maxX + offset,
              minY: seatGroup.bounds.minY + offset,
              maxY: seatGroup.bounds.maxY + offset,
            },
          };

          state.seatGroups.push(newSeatGroup);
          state.selected = {
            type: 'seat',
            id: newId,
            seatGroup: newSeatGroup,
            isMultipleSeats: state.copyingItem.isMultipleSeats,
          };
        }
      }
    },
  },
});

export const mapBuilderHistoryMiddleware = createListenerMiddleware();

mapBuilderHistoryMiddleware.startListening({
  matcher: isAnyOf(
    mapBuilder.actions.addSeatGroup,
    mapBuilder.actions.addShape,
    mapBuilder.actions.addText,
    mapBuilder.actions.updateSeatGroup,
    mapBuilder.actions.updateShape,
    mapBuilder.actions.updateText,
    mapBuilder.actions.deleteSeatGroup,
    mapBuilder.actions.deleteShape,
    mapBuilder.actions.deleteText,
    mapBuilder.actions.setShapes,
    mapBuilder.actions.setSeatGroups,
    mapBuilder.actions.addFiles,
    mapBuilder.actions.updateFile,
    mapBuilder.actions.deleteFile,
    mapBuilder.actions.addAreaShape,
    mapBuilder.actions.updateAreaShape,
    mapBuilder.actions.deleteAreaShape,
    mapBuilder.actions.setAreaShapes,
    mapBuilder.actions.deleteSelectedItem,
    mapBuilder.actions.duplicateSelectedItem,
    mapBuilder.actions.pasteCopyingItem,
  ),
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(mapBuilder.actions.saveToHistory());
  },
});

export const mapBuilderActions = mapBuilder.actions;

export default mapBuilder.reducer;
