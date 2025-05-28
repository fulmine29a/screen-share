import {
  connectionAppStart,
  connectionAppStop,
  connectionSetCandidatesEventListener,
  connectionSetStatusEventListener,
} from "../connection";
import { createAppThunk } from "../../shared/store/create-app-thunk";
import { setControlChannel } from "../../entities/control-channel/control-channel";
import {
  streamsIncomingConnectionAppStop,
  streamsIncomingConnectionCreated,
} from "../streams/incoming";
import { streamsAppStop } from "../streams/app-stop";

export const appStart = createAppThunk("appStart", async (_, { dispatch }) => {
  await dispatch(connectionAppStart());
});

export const appConnectionCreated = createAppThunk(
  "appConnectionCreated",
  async (_, { dispatch }) => {
    dispatch(connectionSetCandidatesEventListener());
    dispatch(connectionSetStatusEventListener());
    dispatch(streamsIncomingConnectionCreated());
  },
);

export const appStop = createAppThunk("appStop", async (_, { dispatch }) => {
  await dispatch(streamsIncomingConnectionAppStop());
  await dispatch(streamsAppStop());
  await dispatch(connectionAppStop());
});

export const appControlChannelCreated = createAppThunk(
  "appControlChannelCreated",
  async (dc: RTCDataChannel) => {
    setControlChannel(dc);
  },
);
