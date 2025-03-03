import { createSlice } from "@reduxjs/toolkit"

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    isAuth: false,
  },
  reducers: {
    createUserInfo(state, action) {
      return action.payload
    },
    removeUserInfo(state, action) {
      return {isAuth: false,}
    }
  }
})

export const { createUserInfo , removeUserInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;