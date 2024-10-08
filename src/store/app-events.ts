import { createAppThunk } from "./store";
import {
  connectionAppStart,
  connectionAppStop,
  connectionSetCandidatesEventListener,
  connectionSetStatusEventListener,
} from "./connection/thunks";

export const appStart = createAppThunk("appStart", async (_, { dispatch }) => {
  await dispatch(connectionAppStart());
});

export const appConnectionCreated = createAppThunk(
  "appConnectionCreated",
  async (_, { dispatch }) => {
    dispatch(connectionSetCandidatesEventListener());
    dispatch(connectionSetStatusEventListener());
  },
);

export const appStop = createAppThunk("appStop", async (_, { dispatch }) => {
  await dispatch(connectionAppStop());
});

export const appRemoveConnectionListeners = createAppThunk(
  "appRemoveConnectionListeners",
  async () => {},
);
