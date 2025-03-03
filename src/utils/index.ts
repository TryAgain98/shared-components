import { SEAT } from '@/constants/maps';
import { Category } from '@/types/map/category';
import {  SeatType } from '@/types/map/seat';
import Konva from 'konva';
import { RefObject } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const getPointerPosition = (stageRef: RefObject<Konva.Stage | null>) => {
  const stage = stageRef.current;
  if (!stage) return;

  const point = stage.getPointerPosition();
  if (!point) return;

  const scale = stage.scaleX();
  const x = (point.x - stage.x()) / scale;
  const y = (point.y - stage.y()) / scale;
  return { x, y, scale };
};

export function calculateGhostSeatsGeometry(
  ghostSeats: SeatType[],
  scale: number,
) {
  const firstSeat = ghostSeats[0];
  const lastSeat = ghostSeats[ghostSeats.length - 1];
  const mapWidth = window.innerWidth / scale;
  const mapHeight = window.innerHeight / scale;

  let linePoints: number[];

  if (firstSeat.x === lastSeat.x) {
    linePoints = [firstSeat.x, -mapHeight, firstSeat.x, mapHeight];
  } else {
    const slope = (lastSeat.y - firstSeat.y) / (lastSeat.x - firstSeat.x);
    const startX = -mapWidth;
    const startY = firstSeat.y - slope * (firstSeat.x - startX);
    const endX = mapWidth;
    const endY = firstSeat.y + slope * (endX - firstSeat.x);
    linePoints = [startX, startY, endX, endY];
  }

  const { centerX, centerY } = ghostSeats.reduce(
    (acc, seat) => ({
      centerX: acc.centerX + seat.x,
      centerY: acc.centerY + seat.y,
    }),
    { centerX: 0, centerY: 0 },
  );

  return {
    linePoints,
    center: {
      x: centerX / ghostSeats.length,
      y: centerY / ghostSeats.length,
    },
    isAxisAligned: firstSeat.x === lastSeat.x || firstSeat.y === lastSeat.y,
  };
}

export function getGhostSeatRow(
  ghostSeats: SeatType[],
  x: number,
  y: number,
  categories: Category[],
) {
  if (ghostSeats.length > 0) {
    const dx = x - ghostSeats[0].x;
    const dy = y - ghostSeats[0].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const numSeats = Math.floor(distance / SEAT.SPACING);
    const shouldAlignHorizontally = Math.abs(dy) < 15;
    const shouldAlignVertically = Math.abs(dx) < 15;

    const newGhostSeats = Array.from({ length: numSeats }, (_, i) => ({
      id: uuidv4(),
      x: shouldAlignVertically
        ? ghostSeats[0].x
        : ghostSeats[0].x + Math.cos(angle) * (i + 1) * SEAT.SPACING,
      y: shouldAlignHorizontally
        ? ghostSeats[0].y
        : ghostSeats[0].y + Math.sin(angle) * (i + 1) * SEAT.SPACING,
      categoryId: categories.length ? categories[0].id : undefined,
    }));
    return [ghostSeats[0], ...newGhostSeats];
  }
  return [];
}

export function getSeatGroupBounds(seats: SeatType[]) {
  if (seats.length === 0) {
    return {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
    };
  }

  const firstSeat = seats[0];
  const lastSeat = seats[seats.length - 1];

  return {
    minX: Math.min(firstSeat.x, lastSeat.x),
    maxX: Math.max(firstSeat.x, lastSeat.x),
    minY: Math.min(firstSeat.y, lastSeat.y),
    maxY: Math.max(firstSeat.y, lastSeat.y),
  };
}

export function getSelectedSeatRect(selected?: any | null) {
  const seatGroup = selected?.seatGroup;
  if (selected?.type !== 'seat' || !seatGroup) return null;

  const { maxX, maxY, minX, minY } = seatGroup.bounds;

  const padding = SEAT.RADIUS;

  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}