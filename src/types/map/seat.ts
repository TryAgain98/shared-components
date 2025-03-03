export type SeatType = {
  id: string;
  x: number;
  y: number;
  name?: string;
  isSelected?: boolean;
  categoryId?: string;
};

export type RowLabeling = {
  label: string;
  position: 'left' | 'right';
};

export type SeatLabeling = {
  start_at: string;
};

export type RowType = {
  numberOfSeats: number;
  seatSpacing: number;
  curve?: number;
};

export interface SeatGroup {
  id: string;
  seats: SeatType[];
  row: RowType;
  rowLabeling?: RowLabeling;
  seatLabeling?: SeatLabeling;
  isSelected?: boolean;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

export type EditSeatForm = {
  id: string;
  name: string;
  categoryId: string;
};

export type EditSeatsForm = {
  id: string;
  categoryId: string;
  row: RowType;
  rowLabeling: RowLabeling;
  seatLabeling: SeatLabeling;
};
