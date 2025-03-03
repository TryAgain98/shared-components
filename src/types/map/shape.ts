export type ShapeType = 'rect' | 'ellipse' | 'polygon';

export type ShapeBaseData = {
  id: string;
  type: ShapeType;

  color: string;
  strokeWidth?: number;
  strokeColor?: string;
  scale?: number;
  isFront?: boolean;
  rotation?: number;

  label?: string;
  labelFontSize?: number;
};

export type RectShapeData = ShapeBaseData & {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  cornerRadius?: number;
};

export type EllipseShapeData = ShapeBaseData & {
  type: 'ellipse';
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PolygonShapeData = ShapeBaseData & {
  type: 'polygon';
  points: number[];
};

export type ShapeData = RectShapeData | EllipseShapeData | PolygonShapeData;
