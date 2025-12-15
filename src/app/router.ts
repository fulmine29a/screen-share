import { createBrowserRouter, RouteObject } from "react-router";
import { StartPage } from "../pages/start";
import { CreateServerPage } from "../pages/create-server";
import { CreateClientPage } from "../pages/create-client";
import { ShowAnswerPage } from "../pages/show-answer";
import { FullScreenLoader } from "../widgets/streams/full-screen-loader";

export const CREATE_SERVER_PATH = "/create-server";
export const CREATE_CLIENT_PATH = "/create-client";
export const SHOW_ANSWER_PATH = "/show-answer";
export const CONNECTING_PATH = "/connecting";
export const CONNECTED_PATH = "/connected";

// TODO: https://reactrouter.com/start/framework/navigating#redirect -- use for check status?
// TODO: https://reactrouter.com/how-to/navigation-blocking
// TODO: connection failed page

const routes: RouteObject[] = [
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
    // TODO: check connection status
    path: CONNECTING_PATH,
    Component: FullScreenLoader,
  },
  {
    path: CONNECTED_PATH,
    Component: null,
  },
];

export const router = createBrowserRouter(routes);
