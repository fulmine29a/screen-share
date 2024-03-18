import { Middleware } from "@reduxjs/toolkit";
import { AppThunkConfig } from "../store";
import { errorSlice } from "./slice";

export const thunkErrorHandingMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (typeof action == "object" && action) {
      if ("type" in action && typeof action.type == "string") {
        if (action.type.endsWith("/rejected")) {
          if (
            "error" in action &&
            typeof action.error == "object" &&
            action.error
          ) {
            const error = action.error as AppThunkConfig["serializedErrorType"];

            store.dispatch(
              errorSlice.actions.add({
                message: error.message,
                name: error.name,
                stack: error.stack,
              }),
            );
          }
        }
      }
    }

    next(action);
  };
