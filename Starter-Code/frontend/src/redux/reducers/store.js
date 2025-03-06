import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/index";
import adminOrdersReducer from "./adminOrders/index"
import orderReducer from "./createOrder/index"; 
import  AdminCategoryReducer from "./adminCategories";
import userCategories from "./userCategory"
import collectorOrdersReducer from "./collectorOrders";
import requestReducer from "../reducers/request/index"
import OrdersReducer from "../reducers/OrderCreate/index"

const store = configureStore({
  reducer: {
    authReducer: authReducer,
    adminOrdersReducer: adminOrdersReducer,
    collectorOrdersReducer: collectorOrdersReducer,
    adminCategories: AdminCategoryReducer,
    order: orderReducer,
    userCategory:userCategories,
    userRequest :requestReducer,
    orders:OrdersReducer
    
  },
});

export default store;