import { getSeatGroupBounds, getSelectedSeatRect } from '@/utils';
import { RowLabel } from './RowLabel';
import { mapBuilderActions } from '@/store/map-builder.slice';
import { useAppDispatch, useAppSelector } from '@/store';
import { SEAT, WHEELCHAIR_ICON } from '@/constants/maps';
import { ActionType } from '@/types/map/action';
import { SeatGroup } from '@/types/map/seat';
import { KonvaEventObject } from 'konva/lib/Node';
import  {  useMemo } from 'react';
import { Group, Circle, Text } from 'react-konva';
import { Path } from 'react-konva';
import { SelectionHighlight } from '../SelectionHighlight';

interface SeatRendererProps {
  seatGroups: SeatGroup[];
  isSelected?: boolean;
}

export function SeatRenderer({ seatGroups, isSelected }: SeatRendererProps) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.mapBuilder.selected);
  const actionType = useAppSelector((state) => state.mapBuilder.actionType);
  const categories = useAppSelector((state) => state.mapBuilder.categories);
  const bounds = useMemo(() => {
    return getSelectedSeatRect(selected);
  }, [selected]);

  const onClickSeatGroup = (seatGroup: SeatGroup) => {
    if (actionType !== ActionType.Mouse) return;

    dispatch(
      mapBuilderActions.setSelected({
        type: 'seat',
        id: seatGroup.id,
        seatGroup,
        isMultipleSeats: seatGroup.seats.length > 1,
      }),
    );
  };

  const handleDragEnd = (
    e: KonvaEventObject<DragEvent>,
    seatGroup: SeatGroup,
  ) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();
    node.position({ x: 0, y: 0 });

    const updatedSeats = seatGroup.seats.map((seat) => ({
      ...seat,
      x: seat.x + newX,
      y: seat.y + newY,
    }));

    const newSeatGroup = {
      ...seatGroup,
      seats: updatedSeats,
      bounds: getSeatGroupBounds(updatedSeats),
    };
    dispatch(mapBuilderActions.updateSeatGroup(newSeatGroup));
  };

  return (
    <>
      {seatGroups?.map((seatGroup) => {
        const { id, seats } = seatGroup;
        return (
          <Group
            key={id}
            onClick={() => onClickSeatGroup(seatGroup)}
            draggable={actionType === ActionType.Mouse}
            onDragEnd={(e) => handleDragEnd(e, seatGroup)}
          >
            <SelectionHighlight bounds={bounds} show={selected?.id === id} />
            <RowLabel seats={seats} label={seatGroup.rowLabeling?.label} />
            {seats.map((seat) => {
              const category = categories.find((c) => c.id === seat.categoryId);
              const seatColor = category?.color || '#a2a2a2';
              return (
                <Group key={seat.id} name={seat.id} x={seat.x} y={seat.y}>
                  <Circle
                    radius={SEAT.RADIUS}
                    fill={`${seatColor}`}
                    strokeWidth={1}
                    stroke={
                      isSelected || selected?.id === id
                        ? '#000000'
                        : 'transparent'
                    }
                  />
                  {category?.isWheelchair && !seat.name && (
                    <Path
                      data={WHEELCHAIR_ICON}
                      fill="white"
                      scaleX={0.5}
                      scaleY={0.5}
                      x={-SEAT.RADIUS / 2}
                      y={-SEAT.RADIUS / 2}
                    />
                  )}
                  <Text
                    text={seat.name}
                    fontSize={8}
                    fill="white"
                    align="center"
                    verticalAlign="middle"
                    width={30}
                    height={30}
                    offsetX={15}
                    offsetY={15}
                  />
                </Group>
              );
            })}
          </Group>
        );
      })}
    </>
  );
}
