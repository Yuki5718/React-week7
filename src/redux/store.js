import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./toastSlice"
import userInfoReducer from "./userInfoSlice"
import loadingReducer from "./loadingSlice"

const store = configureStore({
  reducer: {
    toast : toastReducer,
    userInfo : userInfoReducer,
    loading: loadingReducer
  }
})

export default store;