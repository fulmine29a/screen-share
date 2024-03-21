import React, { useMemo } from "react";
import { Provider } from "react-redux";
import { ErrorBoundary } from "./error-boundary";
import { createStore } from "../store/store";
import { App } from "./app";

export const Wrappers = () => {
  const store = useMemo(createStore, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Provider>
    </React.StrictMode>
  );
};
