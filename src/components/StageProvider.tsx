import Konva from 'konva';
import { createContext, useContext } from 'react';

export const StageContext = createContext<Konva.Stage | null>(null);

interface StageProviderProps {
  children: React.ReactNode;
  stageRef: React.RefObject<Konva.Stage>;
}

export function StageProvider({ children, stageRef }: StageProviderProps) {
  return (
    <StageContext.Provider value={stageRef.current}>
      {children}
    </StageContext.Provider>
  );
}

export function useStage() {
  return useContext(StageContext);
}
