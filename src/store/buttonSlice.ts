import { createSlice } from '@reduxjs/toolkit';

export interface ButtonState {
  isActive: boolean;
  clickCount: number;
}

const initialState: ButtonState = {
  isActive: false,
  clickCount: 0
};

export const buttonSlice = createSlice({
  name: 'button',
  initialState,
  reducers: {
    toggleActive: (state) => {
      state.isActive = !state.isActive;
    },
    incrementCount: (state) => {
      state.clickCount += 1;
    }
  }
});

export const { toggleActive, incrementCount } = buttonSlice.actions;
export default buttonSlice.reducer; 