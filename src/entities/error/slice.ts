import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppError = {
  name?: string;
  message?: string;
  stack?: string;
};

const initialState: { errors: AppError[] } = {
  errors: [],
};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    add(state, { payload }: PayloadAction<AppError>) {
      state.errors.push(payload);
    },
    raiseError() {
      throw new Error("error in reducer");
    },
  },
  selectors: {
    errors(state) {
      return state.errors;
    },
  },
});
