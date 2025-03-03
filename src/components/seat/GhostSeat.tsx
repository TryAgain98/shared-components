import { getPointerPosition } from '@/utils';
import { SEAT } from '@/constants/maps';
import Konva from 'konva';
import React, { RefObject } from 'react';
import { Circle, Line } from 'react-konva';

interface GhostSeatProps {
  stageRef: RefObject<Konva.Stage | null>;
}

const GhostSeat = ({ stageRef }: GhostSeatProps) => {
  const circleRef = React.useRef<Konva.Circle>(null);
  const lineRefs = React.useRef<(Konva.Line | null)[]>([]);

  React.useEffect(() => {
    if (!stageRef.current || !circleRef.current) return;

    const updatePosition = () => {
      const pointerPosition = getPointerPosition(stageRef);
      if (!pointerPosition || !circleRef.current) return;
      const { x, y, scale } = pointerPosition;

      // Update circle position
      circleRef.current.position({ x, y });

      // Update points for Lines
      lineRefs.current.forEach((line, index) => {
        if (!line) return;

        const stageX = -stage.x() / scale;
        const stageY = -stage.y() / scale;
        const windowWidth = window.innerWidth / scale;
        const windowHeight = window.innerHeight / scale;

        switch (index) {
          case 0: // Top horizontal line
            line.points([
              stageX,
              y - SEAT.RADIUS,
              stageX + windowWidth,
              y - SEAT.RADIUS,
            ]);
            break;
          case 1: // Bottom horizontal line
            line.points([
              stageX,
              y + SEAT.RADIUS,
              stageX + windowWidth,
              y + SEAT.RADIUS,
            ]);
            break;
          case 2: // Left vertical line
            line.points([
              x - SEAT.RADIUS,
              stageY,
              x - SEAT.RADIUS,
              stageY + windowHeight,
            ]);
            break;
          case 3: // Right vertical line
            line.points([
              x + SEAT.RADIUS,
              stageY,
              x + SEAT.RADIUS,
              stageY + windowHeight,
            ]);
            break;
        }
      });
    };

    const stage = stageRef.current;
    stage.on('mousemove', updatePosition);

    return () => {
      stage.off('mousemove', updatePosition);
    };
  }, [stageRef]);

  return (
    <>
      <Circle
        ref={circleRef}
        radius={SEAT.RADIUS}
        fill={`${SEAT.GHOST_COLOR}7f`}
        stroke={SEAT.GHOST_COLOR}
        strokeWidth={2}
      />
      {[...Array(4)].map((_, i) => (
        <Line
          key={i}
          ref={(el) => (lineRefs.current[i] = el)}
          points={[0, 0, 0, 0]}
          stroke={SEAT.GHOST_COLOR}
          strokeWidth={1}
          dash={[4, 4]}
        />
      ))}
    </>
  );
};

export default GhostSeat;
