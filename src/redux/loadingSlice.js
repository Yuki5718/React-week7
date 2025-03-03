import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    ScreenLoading: {
      isLoading: false
    },
    BtnLoading: {
      isLoading: false
    }
  },
  reducers: {
    setScreenLoadingStart(state) {
      state.ScreenLoading.isLoading = true
    },
    setScreenLoadingEnd(state) {
      state.ScreenLoading.isLoading = false
    },
    setBtnLoadingStart(state){
      state.BtnLoading.isLoading = true
    },
    setBtnLoadingEnd(state){
      state.BtnLoading.isLoading = false
    }
  }
})

export const { setScreenLoadingStart , setScreenLoadingEnd , setBtnLoadingStart , setBtnLoadingEnd } = loadingSlice.actions

export default loadingSlice.reducer;