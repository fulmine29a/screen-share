import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";

export const Wrappers = () => (
  <React.StrictMode>
    <Provider store={store}>123c</Provider>
  </React.StrictMode>
);
