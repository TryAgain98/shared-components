import { mapBuilderActions } from '@/store/map-builder.slice';
import { useAppSelector } from '@/store';
import { useAppDispatch } from '@/store';
import { SEAT_SPACING } from '@/constants/maps';
import { ActionType } from '@/types/map/action';
import { SeatType, SeatGroup } from '@/types/map/seat';
import { useCallback, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface UseSeatDrawerProps {
  onAdded?: (seatData: SeatType) => void;
}

export function useSeatDrawer({ onAdded }: UseSeatDrawerProps) {
  const dispatch = useAppDispatch();
  const actionType = useAppSelector((state) => state.mapBuilder.actionType);
  const categories = useAppSelector((state) => state.mapBuilder.categories);
  const seatGroups = useAppSelector((state) => state.mapBuilder.seatGroups);
  const selectedSeatGroups = useAppSelector(
    (state) => state.mapBuilder.selectedSeatGroups,
  );

  const updateSeatGroup = () => {
    let selectedSeatGroups: SeatGroup[] = [];
    let unselectedSeatGroups: SeatGroup[] = [];
    if (
      actionType !== ActionType.Mouse ||
      (seatGroups.length && !seatGroups[0].isSelected)
    ) {
      unselectedSeatGroups = seatGroups;
    } else {
      const firstUnselectedIndex = seatGroups.findIndex(
        (group) => !group.isSelected,
      );
      // If no unselected seats found
      if (firstUnselectedIndex === -1) {
        selectedSeatGroups = seatGroups;
      } else {
        // Split array into two parts at firstUnselectedIndex
        selectedSeatGroups = seatGroups.slice(0, firstUnselectedIndex);
        unselectedSeatGroups = seatGroups.slice(firstUnselectedIndex);
      }
    }

    dispatch(mapBuilderActions.setSelectedSeatGroups(selectedSeatGroups));
    dispatch(mapBuilderActions.setUnselectedSeatGroups(unselectedSeatGroups));
  };

  useEffect(() => {
    updateSeatGroup();
  }, [seatGroups]);

  const selectedSeatGroupsBounds = useMemo(() => {
    return selectedSeatGroups.reduce(
      (acc, group) => ({
        minX: Math.min(acc.minX, group.bounds.minX),
        maxX: Math.max(acc.maxX, group.bounds.maxX),
        minY: Math.min(acc.minY, group.bounds.minY),
        maxY: Math.max(acc.maxY, group.bounds.maxY),
      }),
      {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
      },
    );
  }, [selectedSeatGroups]);

  const handleSeatClick = useCallback(
    (x: number, y: number) => {
      if (actionType !== ActionType.Seat) return;

      const newSeat: SeatType = {
        id: uuidv4(),
        x: x,
        y: y,
        categoryId: categories.length ? categories[0].id : undefined,
      };

      dispatch(
        mapBuilderActions.addSeatGroup([
          {
            id: uuidv4(),
            seats: [newSeat],
            bounds: {
              minX: newSeat.x,
              maxX: newSeat.x,
              minY: newSeat.y,
              maxY: newSeat.y,
            },
            row: {
              numberOfSeats: 1,
              seatSpacing: SEAT_SPACING,
            },
          },
        ]),
      );
      onAdded?.(newSeat);
    },
    [actionType, onAdded],
  );

  return {
    selectedSeatGroupsBounds,
    handleSeatClick,
  };
}
