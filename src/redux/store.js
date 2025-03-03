import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./toastSlice"
import userInfoReducer from "./userInfoSlice"

const store = configureStore({
  reducer: {
    toast : toastReducer,
    userInfo : userInfoReducer
  }
})

export default store;