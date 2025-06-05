import React, { useMemo } from "react";
import { Provider } from "react-redux";
import { ErrorBoundary } from "./error-boundary";
import { createAppStore } from "./store";
import { App } from "./app";

export const Wrappers = () => {
  const store = useMemo(() => createAppStore(), []);

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
