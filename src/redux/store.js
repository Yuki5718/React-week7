import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./toastSlice"
import userInfoReducer from "./userInfoSlice"
import loadingReducer from "./loadingSlice"
import modalStateReducer from "./modalStateSlice"

const store = configureStore({
  reducer: {
    toast : toastReducer,
    userInfo : userInfoReducer,
    loading: loadingReducer,
    modalState: modalStateReducer,
  }
})

export default store;