import { createSlice } from "@reduxjs/toolkit";

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
  can_ice: 0,
  can_hot: 0,
};


const modalStateSlice = createSlice({
  name: "modalState",
  initialState: {
    isModalOpen: false,
    modalMode: "create",
    modalState: defaultModalState
  },
  reducers:{
    editProduct(state, action) {
      const { mode , product } = action.payload
      switch (mode) {
        case "create":
          state.modalMode = mode
          state.modalState = defaultModalState
          state.isModalOpen = true
          break;
        case "edit":
          state.modalMode = mode
          state.modalState = product
          state.isModalOpen = true
          break;

        default:
          break;
      }
    },
    closeModal(state, action) {
      state.isModalOpen = false
    }
  }
})

export const { editProduct , closeModal } = modalStateSlice.actions;

export default modalStateSlice.reducer;