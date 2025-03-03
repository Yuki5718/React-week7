import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./toastSlice"
import userInfoReducer from "./userInfoSlice"
import loadingReducer from "./loadingSlice"
import modalStateReducer from "./modalStateSlice"
import productsReducer from "./productsSlice"

const store = configureStore({
  reducer: {
    toast : toastReducer,
    userInfo : userInfoReducer,
    loading: loadingReducer,
    modalState: modalStateReducer,
    products: productsReducer,
  }
})

export default store;