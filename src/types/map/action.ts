export enum ActionType {
  Mouse = 'Mouse',
  Seat = 'Seat',
  SeatRow = 'SeatRow',
  SeatRows = 'SeatRows ',
  Hand = 'Hand',
  RectShape = 'RectShape',
  EllipseShape = 'EllipseShape',
  PolygonShape = 'PolygonShape',
  Text = 'Text',
  UpdateImage = 'UpdateImage',
  AreaShapeRect = 'AreaShapeRect',
  AreaShapeEllipse = 'AreaShapeEllipse',
  AreaShapePolygon = 'AreaShapePolygon',
}

export type TSelectionBox = {
  start: { x: number; y: number };
  current?: { x: number; y: number };
};

export const isAreaShapeAction = (actionType: ActionType): boolean => {
  return (
    actionType === ActionType.AreaShapeRect ||
    actionType === ActionType.AreaShapeEllipse ||
    actionType === ActionType.AreaShapePolygon
  );
};

export const isShapeAction = (actionType: ActionType): boolean => {
  return (
    actionType === ActionType.RectShape ||
    actionType === ActionType.EllipseShape ||
    actionType === ActionType.PolygonShape
  );
};
