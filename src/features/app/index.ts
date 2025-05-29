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

export const appStart = createAppThunk("appStart", async (_, { dispatch }) => {
  await dispatch(connectionAppStart());
});

export const appConnectionCreated = createAppThunk(
  "appConnectionCreated",
  async (_, { dispatch }) => {
    dispatch(connectionSetCandidatesEventListener());
    dispatch(connectionSetStatusEventListener());
    dispatch(streamsIncomingConnectionCreated());
    dispatch(controlChannelConnectionCreated());
  },
);

export const appStop = createAppThunk("appStop", async (_, { dispatch }) => {
  await dispatch(streamsIncomingConnectionAppStop());
  await dispatch(streamsAppStop());
  await dispatch(connectionAppStop());
});

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

export const appSendControlChannelMessage = createAppThunk(
  "appSendControlChannelMessage",
  async (msg: ControlChannelMessage, { dispatch }) => {
    dispatch(controlChannelSend(msg));
  },
);
