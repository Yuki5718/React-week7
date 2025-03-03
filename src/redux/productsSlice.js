import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState:{
    products:[],
    pagination:{}
  },
  reducers: {
    setProductsState(state, action) {
      return action.payload
    }
  }
})

export const { setProductsState } = productsSlice.actions;

export default productsSlice.reducer;