import { RouterProvider } from "react-router";
import React from "react";
import { router } from "./router";

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};
