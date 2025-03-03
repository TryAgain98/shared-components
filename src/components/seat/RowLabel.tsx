import { SEAT } from '@/constants/maps';
import { SeatType } from '@/types/map/seat';
import { Text } from 'react-konva';

interface RowLabelProps {
  seats: SeatType[];
  label?: string;
}

export const calculateLabelPosition = (seats: SeatType[], label: string) => {
  if (seats.length === 0) return { x: 0, y: 0, rotation: 0 };

  const [firstSeat, lastSeat] = [seats[0], seats[seats.length - 1]];
  const dx = lastSeat.x - firstSeat.x;
  const dy = lastSeat.y - firstSeat.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const textWidth = label.length * SEAT.RADIUS;
  const baseOffsetRight = textWidth + Math.max(5, textWidth * 0.2);
  const baseOffset = textWidth + Math.max(15, textWidth * 0.2);
  const verticalOffset = -SEAT.RADIUS;

  if (seats.length < 2) {
    return {
      x: seats[0].x - baseOffset,
      y: seats[0].y + verticalOffset,
      rotation: 0,
    };
  }

  const isStartFromRight = firstSeat.x > lastSeat.x;

  if (angle > 90) angle -= 180;
  if (angle < -90) angle += 180;

  const position = isStartFromRight
    ? {
        x: firstSeat.x + Math.cos((angle * Math.PI) / 180) * baseOffsetRight,
        y:
          firstSeat.y +
          Math.sin((angle * Math.PI) / 180) * baseOffsetRight +
          verticalOffset,
        rotation: angle,
      }
    : {
        x: firstSeat.x - Math.cos((angle * Math.PI) / 180) * baseOffset,
        y:
          firstSeat.y -
          Math.sin((angle * Math.PI) / 180) * baseOffset +
          verticalOffset,
        rotation: angle,
      };

  return position;
};

export const RowLabel = ({ seats, label = '' }: RowLabelProps) => {
  if (!label || seats.length === 0) return null;
  const { x, y, rotation } =  calculateLabelPosition(seats, label)

  return (
    <Text
      text={label}
      fontSize={14}
      fill="#000"
      x={x}
      y={y}
      align="right"
      verticalAlign="middle"
      rotation={rotation}
    />
  );
};
