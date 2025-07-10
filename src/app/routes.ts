import { RouteObject } from "react-router";
import { StartPage } from "../pages/start";
import { CreateServerPage } from "../pages/create-server";
import { CreateClientPage } from "../pages/create-client";
import { ShowAnswerPage } from "../pages/show-answer";
import { FullScreenLoader } from "../widgets/streams/full-screen-loader";

export const CREATE_SERVER_PATH = "/create-server";
export const CREATE_CLIENT_PATH = "/create-client";
export const SHOW_ANSWER_PATH = "/show-answer";
export const CONNECTING_PATH = "/connecting";

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
  {
    path: SHOW_ANSWER_PATH,
    Component: ShowAnswerPage,
  },
  {
    path: CONNECTING_PATH,
    Component: FullScreenLoader,
  },
];
