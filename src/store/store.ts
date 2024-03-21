import {
  configureStore,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";
import { errorSlice } from "./error/slice";
import { thunkErrorHandingMiddleware } from "./error/middleware";
import { connectionSlice } from "./connection/slice";

export function createStore() {
  return configureStore({
    reducer: {
      error: errorSlice.reducer,
      connection: connectionSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(thunkErrorHandingMiddleware),
  });
}

export type AppStore = ReturnType<typeof createStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export type AppThunkConfig = {
  state: RootState;
  dispatch: AppDispatch;
  serializedErrorType: SerializedError;
};

export const createAppThunk: ReturnType<
  typeof createAsyncThunk.withTypes<AppThunkConfig>
> = createAsyncThunk;
