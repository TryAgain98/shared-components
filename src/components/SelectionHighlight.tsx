import { SELECTION_BOUND_COLOR } from '@/constants/maps';
import { useAppDispatch, useAppSelector } from '@/store';
import Konva from 'konva';
import { useCallback } from 'react';
import { Group, Rect, Circle } from 'react-konva';
import { mapBuilderActions } from '@/store/map-builder.slice';
interface SelectionHighlightProps {
  show: boolean;
  bounds: { x: number; y: number; width: number; height: number } | null;
  onRotate?: (rotation: number) => void;
  initialRotation?: number;
}

export const SelectionHighlight = ({
  show,
  bounds,
  onRotate,
  initialRotation,
}: SelectionHighlightProps) => {
  const currentRotation = useAppSelector(
    (state) => state.mapBuilder.currentRotation,
  );
  const dispatch = useAppDispatch();

  // Helper function to calculate angle between points
  const getAngle = useCallback(
    (center: { x: number; y: number }, point: { x: number; y: number }) => {
      return (
        (Math.atan2(point.y - center.y, point.x - center.x) * 180) / Math.PI
      );
    },
    [],
  );

  const handleRotateStart = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      e.cancelBubble = true;
      if (!onRotate) return;

      const stage = e.target.getStage();
      if (!stage) return;

      // Get the parent group that contains the selected element
      const group = e.target.getParent()?.getParent();
      if (!group) return;

      // Get stage coordinates of the group's center
      const groupPos = group.getAbsolutePosition();
      const center = {
        x: groupPos.x,
        y: groupPos.y,
      };

      // Get initial pointer position
      const startPos = stage.getPointerPosition();
      if (!startPos) return;

      const startAngle = getAngle(center, startPos);
      let newRotation = initialRotation ?? 0;

      function handleRotateMove(e: Konva.KonvaEventObject<MouseEvent>) {
        const pos = stage?.getPointerPosition();
        if (!pos) return;

        const currentAngle = getAngle(center, pos);
        // Always use a valid rotation value
        const baseRotation = currentRotation ?? initialRotation ?? 0;
        newRotation = baseRotation + (currentAngle - startAngle);

        // Normalize angle to 0-360
        newRotation = ((newRotation % 360) + 360) % 360;

        // Snap to 15-degree intervals when holding Shift
        if (e.evt.shiftKey) {
          newRotation = Math.round(newRotation / 15) * 15;
        }
        // dispatch(mapBuilderActions.setCurrentRotation(newRotation));
        dispatch(mapBuilderActions.setEditingPreviewRotation(newRotation));
      }

      function handleRotateEnd() {
        if (newRotation !== null) {
          onRotate?.(newRotation);
          // dispatch(mapBuilderActions.setCurrentRotation(null));
          dispatch(mapBuilderActions.setEditingPreviewRotation(null));
        }
        stage?.off('mousemove touchmove', handleRotateMove);
        stage?.off('mouseup touchend', handleRotateEnd);
      }

      stage.on('mousemove touchmove', handleRotateMove);
      stage.on('mouseup touchend', handleRotateEnd);
    },
    [currentRotation, dispatch, getAngle, initialRotation, onRotate],
  );

  if (!show || !bounds) return null;

  return (
    <Group x={bounds.x} y={bounds.y}>
      {/* Selection rectangle */}
      <Rect
        width={bounds.width}
        height={bounds.height}
        stroke={SELECTION_BOUND_COLOR}
        strokeWidth={1}
        fill="transparent"
      />

      {/* Rotation handle */}
      {onRotate && (
        <>
          {/* Rotation line */}
          <Rect
            x={bounds.width / 2 + 1}
            y={-16}
            width={1}
            height={16}
            fill={SELECTION_BOUND_COLOR}
            listening={false}
          />
          {/* Rotation handle circle */}
          <Circle
            x={bounds.width / 2 + 1}
            y={-20}
            radius={4}
            fill={SELECTION_BOUND_COLOR}
            stroke={SELECTION_BOUND_COLOR}
            strokeWidth={1}
            onMouseDown={handleRotateStart}
            onTouchStart={handleRotateStart}
            cursor="grab"
          />
        </>
      )}
    </Group>
  );
};
