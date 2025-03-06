import { createSlice } from "@reduxjs/toolkit";

const collectorOrdersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
  },
  reducers: {
    setCollectorOrders: (state, action) => {
      state.orders = action.payload;
    },
    setOrderDetails: (state, action) => {
      const updatedOrder = action.payload;
      state.orders = state.orders.map((order) => {
        if (order.order_id === updatedOrder.id) {
          return {
            ...order,
            status: updatedOrder.status,
            last_price:updatedOrder.last_price
          };
        }
        return order;
      });
    },
  },
});

export const { setCollectorOrders, setOrderDetails } =
  collectorOrdersSlice.actions;
export default collectorOrdersSlice.reducer;
