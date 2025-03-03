import { GridMap } from './GridMap';
// import { MapStageZoomButtons } from './MapStageZoomButtons';
// import { StageProvider } from './StageProvider';
// import BaseComponentEditor from './component-editor';
// import useMap from './hooks/useMap';
// import { useMapShortcuts } from './hooks/useMapShortcuts';
import { SeatRenderer } from './seat/SeatRenderer';
// import InputUpload from './upload-image/InputUpload';
import useMeasure from '@/hooks/useMeasure';
import {
  ActionType,
  isAreaShapeAction,
  isShapeAction,
} from '@/types/map/action';
import Konva from 'konva';
// import { KonvaEventObject } from 'konva/lib/Node';  
import  {  useMemo, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { useAppSelector } from '@/store';
import { StageProvider } from './StageProvider';
import GhostSeat from './seat/GhostSeat';
// import { mapBuilderActions } from '@/store/map-builder.slice';

const STAGE_PADDING = 30;

export type MapStageProps = {
  width?: number;
  height?: number;
}
export  function MapStage({ width = 1000, height = 1000 }: MapStageProps) {
  // const dispatch = useAppDispatch();

  const actionType = useAppSelector((state) => state.mapBuilder.actionType);
  const isDragging = useAppSelector((state) => state.mapBuilder.isDragging);
  // const selected = useAppSelector((state) => state.mapBuilder.selected);
  const unselectedSeatGroups = useAppSelector(
    (state) => state.mapBuilder.unselectedSeatGroups,
  );

  // const selectedSeatGroups = useAppSelector(
  //   (state) => state.mapBuilder.selectedSeatGroups,
  // );

  const stageRef = useRef<Konva.Stage | null>(null);
  const [stageWrapperRef, stageWrapperBounds] = useMeasure();

  // Add the shortcuts hook
  // useMapShortcuts();

  // const { handleWheel, handleScale } = useMap({ stageRef });

  // const { handleSeatClick, selectedSeatGroupsBounds } = useSeatDrawer({});

  // const {
  //   handleMouseDown: handleAreaShapeMouseDown,
  //   handleMouseMove: handleAreaShapeMouseMove,
  //   handleMouseUp: handleAreaShapeMouseUp,
  //   handleShapeClick: handleAreaShapeClick,
  //   areaShapePreview,
  // } = useAreaShapeDrawer({
  //   stageRef,
  // });

  // const {
  //   handleMouseDown: handleShapeMouseDown,
  //   handleMouseMove: handleShapeMouseMove,
  //   handleMouseUp: handleShapeMouseUp,
  //   handleShapeClick: handleShapeClick,
  //   shapePreview,
  // } = useShapeDrawer({
  //   stageRef,
  // });

  // const { handleTextClick } = useTextDrawer({
  //   stageRef,
  //   onAdded: (textData) => {
  //     dispatch(mapBuilderActions.setActionType(ActionType.Mouse));
  //     dispatch(
  //       mapBuilderActions.setSelected({
  //         type: 'text',
  //         id: textData.id,
  //       }),
  //     );
  //     dispatch(mapBuilderActions.setEditingPreview(textData));
  //   },
  // });

  // const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
  //   if (!stageRef.current) return;
  //   const stage = stageRef.current.getStage();
  //   const pointer = stage.getPointerPosition();
  //   if (!pointer) return;

  //   const scale = stage.scaleX();
  //   const correctedX = (pointer.x - stage.x()) / scale;
  //   const correctedY = (pointer.y - stage.y()) / scale;
  //   if (
  //     actionType === ActionType.Mouse &&
  //     e.target === e.target.getStage() &&
  //     selected
  //   ) {
  //     dispatch(mapBuilderActions.setSelected(null));
  //   } else if (actionType === ActionType.Seat) {
  //     return handleSeatClick(correctedX, correctedY);
  //   } else if (actionType === ActionType.Text) {
  //     return handleTextClick(correctedX, correctedY);
  //   } else if (isAreaShapeAction(actionType)) {
  //     return handleAreaShapeClick(correctedX, correctedY);
  //   } else if (isShapeAction(actionType)) {
  //     return handleShapeClick(correctedX, correctedY);
  //   }
  // };

  // const handleMouseMove = () => {
  //   if (!stageRef.current) return;
  //   const stage = stageRef.current.getStage();
  //   const point = stage.getPointerPosition();
  //   if (!point) return;
  //   const scale = stage.scaleX();
  //   const correctedX = (point.x - stage.x()) / scale;
  //   const correctedY = (point.y - stage.y()) / scale;

  //   if (isAreaShapeAction(actionType)) {
  //     handleAreaShapeMouseMove(correctedX, correctedY);
  //   } else if (isShapeAction(actionType)) {
  //     handleShapeMouseMove(correctedX, correctedY);
  //   }
  // };

  // const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
  //   if (isAreaShapeAction(actionType)) {
  //     handleAreaShapeMouseDown(e);
  //   } else if (isShapeAction(actionType)) {
  //     handleShapeMouseDown(e);
  //   }
  // };

  // const handleMouseUp = () => {
  //   if (isShapeAction(actionType)) {
  //     handleShapeMouseUp();
  //   } else if (isAreaShapeAction(actionType)) {
  //     handleAreaShapeMouseUp();
  //   }
  // };

  // const handleZoomIn = useCallback(() => {
  //   if (!stageRef.current) return;
  //   handleScale(stageRef.current.scaleX() * 1.1);
  // }, [handleScale]);

  // const handleZoomOut = useCallback(() => {
  //   if (!stageRef.current) return;
  //   handleScale(stageRef.current.scaleX() * 0.9);
  // }, [handleScale]);

  const cursorStyle = useMemo(() => {
    if (actionType === ActionType.Hand) return 'grab';
    if (actionType === ActionType.Text) return 'text';
    if (isShapeAction(actionType)) return 'crosshair';
    if (isAreaShapeAction(actionType)) return 'crosshair';
    if (isDragging) return 'move';
    return 'default';
  }, [actionType, isDragging]);

  return (
    <StageProvider stageRef={stageRef}>
      {/* <InputUpload stageRef={stageRef} /> */}

      <div className="flex w-full gap-[25px] overflow-hidden">
        <div
          ref={stageWrapperRef}
          className="relative flex-1 overflow-hidden rounded-[16px] bg-[#ffffff] p-[30px]"
        >
          <Stage
            // onClick={handleStageClick}
            // onMouseMove={handleMouseMove}
            width={width || stageWrapperBounds.width - STAGE_PADDING * 2}
            height={height || stageWrapperBounds.height - STAGE_PADDING * 2}
            ref={stageRef}
            draggable={actionType === ActionType.Hand}
            // onWheel={handleWheel}
            // onMouseDown={handleMouseDown}
            // onMouseUp={handleMouseUp}
            style={{
              cursor: cursorStyle,
            }}
          >
            <Layer>
              <GridMap stageRef={stageRef} />
              <SeatRenderer seatGroups={unselectedSeatGroups} />
              <GhostSeat stageRef={stageRef} />
            </Layer>
          </Stage>

          {/* <MapStageZoomButtons
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          /> */}
        </div>

        {/* {(selected || selectedSeatGroups.length > 0) && <BaseComponentEditor />} */}
      </div>
    </StageProvider>
  );
}
