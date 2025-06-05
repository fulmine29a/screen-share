import { RouteObject } from "react-router";
import { StartPage } from "../pages/start";
import { createServerPage } from "../pages/create-server";
import { createClientPage } from "../pages/create-client";

export const CREATE_SERVER_PATH = "/create-server";
export const CREATE_CLIENT_PATH = "/create-client";
export const routes: RouteObject[] = [
  {
    path: "/",
    Component: StartPage,
  },
  {
    path: CREATE_SERVER_PATH,
    Component: createServerPage,
  },
  {
    path: CREATE_CLIENT_PATH,
    Component: createClientPage,
  },
];
