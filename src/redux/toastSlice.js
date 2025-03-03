import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
  messages: [],
};


const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    createMessage(state, action) {
      console.log(state,action);
      const { text , status } = action.payload;
      const id = Date.now();

      state.messages.push({
        id,
        text,
        status
      })
    },
    removeMessage(state, action) {
      const message_id = action.payload
      
      const index = state.messages.findIndex((message) => message.id === message_id)
      if (index !== -1) {
        state.messages.splice(index, 1)
      }
    }
  }
})
// createAsyncThunk
export const { createMessage , removeMessage } = toastSlice.actions;

export default toastSlice.reducer;
