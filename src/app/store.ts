import { configureStore, Middleware, SerializedError } from "@reduxjs/toolkit";
import { errorSlice } from "../entities/error/slice";
import { connectionSlice } from "../entities/connection/slice";
import { streamSlice } from "../entities/streams/slice";
import { thunkErrorHandingMiddleware } from "../entities/error/middleware";

export function createAppStore(
  appendMiddlewares: ReadonlyArray<Middleware> = [],
) {
  return configureStore({
    reducer: {
      error: errorSlice.reducer,
      connection: connectionSlice.reducer,
      streams: streamSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(thunkErrorHandingMiddleware)
        .concat(appendMiddlewares),
  });
}

export type AppStore = ReturnType<typeof createAppStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export type AppThunkConfig = {
  state: RootState;
  dispatch: AppDispatch;
  serializedErrorType: SerializedError;
};
