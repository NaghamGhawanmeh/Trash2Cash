import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  draftRequests: [],
  loading: false,
  error: null,
  success: null,
};

const OrderSlice = createSlice({
  name: "orders", 
  initialState,
  reducers: {
    fetchDraftRequestsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDraftRequestsSuccess(state, action) {
      state.draftRequests = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchDraftRequestsFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    createOrderStart(state) {
      state.loading = true;
      state.success = null;
      state.error = null;
    },
    createOrderSuccess(state, action) {
      state.success = "Order created successfully!";
      state.loading = false;
      state.error = null;
      state.draftRequests = [];
    },
    createOrderFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchDraftRequestsStart,
  fetchDraftRequestsSuccess,
  fetchDraftRequestsFailure,
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
} = OrderSlice.actions;

export default OrderSlice.reducer;
