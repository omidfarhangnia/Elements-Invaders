import { configureStore, createSlice } from "@reduxjs/toolkit";

const randomSlice = createSlice({
  name: "random",
  initialState: { value: "" },
  reducers: {},
});

export const store = configureStore({
  reducer: {
    randomReducer: randomSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
