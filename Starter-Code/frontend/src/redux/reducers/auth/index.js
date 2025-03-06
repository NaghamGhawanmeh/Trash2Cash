import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    userId: localStorage.getItem("userId") || null,
    roleId: localStorage.getItem("roleId") || null,
    isLoggedIn: localStorage.getItem("token") ? true : false,
  },
  reducers: {
    setLogin: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);

      state.roleId = action.payload.roleId; 
      localStorage.setItem("roleId", action.payload.roleId);

      state.isLoggedIn = true;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
      localStorage.setItem("userId", action.payload);
    },
    setLogout: (state) => {
      state.token = null;
      state.userId = null;
      state.roleId = null; 
      state.isLoggedIn = false;
      localStorage.clear(); 
    },
  },
});

export const { setLogin, setUserId, setLogout } = authSlice.actions;
export default authSlice.reducer;
