import { createAppThunk } from "../../shared/store/create-app-thunk";
import {
  streamsIncomingConnectionAppStop,
  streamsIncomingConnectionCreated,
} from "../streams/incoming";
import { streamsAppStop } from "../streams/app-stop";
import { connectionAppStart } from "../connection/connection-app-start";
import { connectionSetStatusEventListener } from "../connection/connection-set-status-event-listener";
import { connectionAppStop } from "../connection/connection-app-stop";
import { connectionSetCandidatesEventListener } from "../connection/connection-set-candidates-event-listener";
import {
  controlChannelConnectionCreated,
  controlChannelSend,
} from "../control-channel";
import { ControlChannelMessage } from "../../entities/control-channel-message";
import { connectionNegotiationNeededMessage } from "../connection/connection-negatiation-needed-message";
import { connectionNegotiationAnswerMessage } from "../connection/connection-negotiation-answer-message";
import { connectionSlice } from "../../entities/connection/slice";
import { cantRunParallel } from "../../shared/cant-run-parallel";
import { takeLeading } from "../../shared/take-leading";
import { CONNECTED_PATH, router } from "../../app/router";

export const appStart = createAppThunk(
  "appStart",
  cantRunParallel(async (_: undefined, { dispatch }) => {
    await dispatch(connectionAppStart()).unwrap();
  }),
);

export const appConnectionCreated = createAppThunk(
  "appConnectionCreated",
  async (_, { dispatch }) => {
    dispatch(connectionSetCandidatesEventListener());
    dispatch(connectionSetStatusEventListener());
    dispatch(streamsIncomingConnectionCreated());
    dispatch(controlChannelConnectionCreated());
  },
);

export const appStop = createAppThunk(
  "appStop",
  cantRunParallel(async (_: undefined, { dispatch }) => {
    await dispatch(streamsIncomingConnectionAppStop()).unwrap();
    await dispatch(streamsAppStop()).unwrap();
    await dispatch(connectionAppStop()).unwrap();
  }),
);

export const appControlChannelMessage = createAppThunk(
  "appControlChannelMessage",
  (msg: ControlChannelMessage, { dispatch }) => {
    switch (msg.type) {
      case "negotiation needed":
        dispatch(connectionNegotiationNeededMessage(msg));
        break;
      case "negotiation answer":
        dispatch(connectionNegotiationAnswerMessage(msg));
        break;
    }
  },
);

export const appConnected = createAppThunk("appConnected", async () => {
  router.navigate(CONNECTED_PATH);
});

export const appSendControlChannelMessage = createAppThunk(
  "appSendControlChannelMessage",
  async (msg: ControlChannelMessage, { dispatch }) => {
    dispatch(controlChannelSend(msg));
  },
);

export const appRestart = createAppThunk(
  "appRestart",
  takeLeading(async (_: undefined, { dispatch, getState }) => {
    const status = connectionSlice.selectors.status(getState());
    if (status == "CREATED") {
      return;
    }
    if (status != "NOT_INITIALIZED") {
      await dispatch(appStop()).unwrap();
    }
    await dispatch(appStart()).unwrap();
    return "restarted" as const;
  }),
);
