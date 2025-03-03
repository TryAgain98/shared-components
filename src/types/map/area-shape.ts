export type AreaShapeType = 'rect' | 'ellipse' | 'polygon';

export type AreaShapeBaseData = {
  id: string;
  categoryId: string;
  type: AreaShapeType;

  scale: number;
  translucency: boolean;
  rotation: number;

  // label
  label: string;
  fontSize: number;

  // capacity
  capacity: number;
};

export type RectAreaShapeData = AreaShapeBaseData & {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  cornerRadius?: number;
};

export type EllipseAreaShapeData = AreaShapeBaseData & {
  type: 'ellipse';
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PolygonAreaShapeData = AreaShapeBaseData & {
  type: 'polygon';
  points: number[];
};

export type AreaShapeData =
  | RectAreaShapeData
  | EllipseAreaShapeData
  | PolygonAreaShapeData;
