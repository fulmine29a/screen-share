import { RouteObject } from "react-router";
import { StartPage } from "../pages/start";
import { CreateServerPage } from "../pages/create-server";
import { CreateClientPage } from "../pages/create-client";

export const CREATE_SERVER_PATH = "/create-server";
export const CREATE_CLIENT_PATH = "/create-client";
export const routes: RouteObject[] = [
  {
    path: "/",
    Component: StartPage,
  },
  {
    path: CREATE_SERVER_PATH,
    Component: CreateServerPage,
  },
  {
    path: CREATE_CLIENT_PATH,
    Component: CreateClientPage,
  },
];
