export const STAGE_WIDTH = 800;
export const STAGE_HEIGHT = 800;
export const GRID_SIZE = 25;
export const MIN_SCALE = 0.2;
export const MAX_SCALE = 2;
export const IMAGE_WIDTH = 200;
export const IMAGE_HEIGHT = 200;

export const SEAT_RADIUS = 7;
export const SEAT_SPACING = 3;

export const SEAT = {
  GHOST_COLOR: '#0079f3',
  RADIUS: SEAT_RADIUS,
  DEFAULT_COLOR: '#000000',
  SPACING: SEAT_RADIUS * 2 + SEAT_SPACING,
  MIN_SPACING: 1,
  MAX_SPACING: 41,
};

export const SELECTION_BOUND_COLOR = '#007df9';
export const SELECTION_BOX_STROKE_COLOR = '#bdc3c760';
export const SELECTION_BOX_FILL_COLOR = '#bdc3c750';

// Area Shape
export const DEFAULT_AREA_SHAPE_STROKE_COLOR = '#444444';
export const DEFAULT_AREA_SHAPE_FILL_COLOR = '#989898';
export const DEFAULT_AREA_SHAPE_STROKE_WIDTH = 2;
export const DEFAULT_AREA_SHAPE_CORNER_RADIUS = 8;
export const DEFAULT_AREA_SHAPE_FONT_SIZE = 14;
export const DEFAULT_AREA_SHAPE_ROTATION = 0;
export const DEFAULT_AREA_SHAPE_SCALE = 1;
export const DEFAULT_AREA_SHAPE_TRANSLUCENCY = false;
export const DEFAULT_AREA_SHAPE_CAPACITY = 0;
export const DEFAULT_AREA_SHAPE_LABEL = '?';

// Shape
export const DEFAULT_SHAPE_FILL_COLOR = '#c9cbcc';
export const DEFAULT_SHAPE_PREVIEW_FILL_COLOR = '#c9cbccaa';
export const DEFAULT_SHAPE_PREVIEW_STROKE_COLOR = '#c9cbcc';
export const DEFAULT_SHAPE_STROKE_WIDTH = 0;
export const DEFAULT_SHAPE_CORNER_RADIUS = 8;
export const DEFAULT_SHAPE_FONT_SIZE = 14;
export const DEFAULT_SHAPE_ROTATION = 0;
export const DEFAULT_SHAPE_SCALE = 1;

// Text
export const DEFAULT_TEXT_TEXT = 'Text';
export const DEFAULT_TEXT_COLOR = '#323335';
export const DEFAULT_TEXT_FONT_SIZE = 16;
export const DEFAULT_TEXT_ROTATION = 0;
export const DEFAULT_TEXT_SCALE = 1;
export const DEFAULT_TEXT_STYLE = 'normal';

export const DEFAULT_CATEGORIES = [
  {
    id: '1',
    name: 'Balcony',
    color: '#219E9E',
    isWheelchair: false,
  },
  {
    id: '2',
    name: 'Group Floor',
    color: '#ed3134',
    isWheelchair: false,
  },
  {
    id: '3',
    name: 'Wheelchair',
    color: '#3090ed',
    isWheelchair: true,
  },
];
export const WHEELCHAIR_ICON =
  'M12 3a1.5 1.5 0 1 0 0 -3 1.5 1.5 0 0 0 0 3m-0.663 2.146a1.5 1.5 0 0 0 -0.47 -2.115l-2.5 -1.508a1.5 1.5 0 0 0 -1.676 0.086l-2.329 1.75a0.866 0.866 0 0 0 1.051 1.375L7.361 3.37l0.922 0.71 -2.038 2.445A4.73 4.73 0 0 0 2.628 7.67l1.064 1.065a3.25 3.25 0 0 1 4.574 4.574l1.064 1.063a4.73 4.73 0 0 0 1.09 -3.998l1.043 -0.292 -0.187 2.991a0.872 0.872 0 1 0 1.741 0.098l0.206 -4.121A1 1 0 0 0 12.224 8h-2.79zM3.023 9.48a3.25 3.25 0 0 0 4.496 4.496l1.077 1.077a4.75 4.75 0 0 1 -6.65 -6.65z';
