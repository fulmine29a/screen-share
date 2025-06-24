import { createBrowserRouter, RouterProvider } from "react-router";
import React, { useMemo } from "react";
import { routes } from "./routes";

export const App: React.FC = () => {
  const router = useMemo(() => createBrowserRouter(routes), []);
  return <RouterProvider router={router} />;
};
