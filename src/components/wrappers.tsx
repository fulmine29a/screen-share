import React, { useMemo } from "react";
import { Provider } from "react-redux";
import { ErrorBoundary } from "./error-boundary";
import { createStore } from "../store/store";

export const Wrappers = () => {
  const store = useMemo(createStore, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <ErrorBoundary>
          <h1>Awesome app</h1>
        </ErrorBoundary>
      </Provider>
    </React.StrictMode>
  );
};
