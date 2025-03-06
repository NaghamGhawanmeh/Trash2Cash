import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  order: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    createOrderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    createOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetOrderState: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
  resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;
