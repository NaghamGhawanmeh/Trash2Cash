import { createSlice } from "@reduxjs/toolkit";

const adminOrdersSlice = createSlice({
  name: "orders ",
  initialState: {
    orders: [],
  },
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setCollector: (state, action) => {
      const updatedOrder = action.payload;
      console.log("herrrr", updatedOrder);

      state.orders = state.orders.map((order) => {
        if (order.order_id === updatedOrder.id) {
          return {
            ...order,
            collector_id:Number( updatedOrder.collector_id),
          };
        }
        return order;
      });
    },
    setOrderStatus: (state, action) => {
      const updatedOrder = action.payload;

      state.orders = state.orders.map((order) => {
        if (order.order_id === updatedOrder.id) {
          return {
            ...order,
            status: updatedOrder.status,
          };
        }
        return order;
      });
    },
  },
});

export const { setOrders, setCollector, setOrderStatus } =
  adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
