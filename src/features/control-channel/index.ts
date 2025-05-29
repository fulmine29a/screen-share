import { createAppThunk } from "../../shared/store/create-app-thunk";
import { getConnection } from "../../entities/connection/connection";
import {
  CONTROL_DATACHANNEL,
  getControlChannel,
  setControlChannel,
} from "../../entities/control-channel/control-channel";
import { appControlChannelMessage } from "../app";
import { ControlChannelMessage } from "../../entities/control-channel-message";

export const controlChannelConnectionCreated = createAppThunk(
  "controlChannelConnectionCreated",
  (_, { dispatch }) => {
    const connection = getConnection();
    connection.addEventListener("datachannel", ({ channel }) => {
      if (channel.label == CONTROL_DATACHANNEL) {
        dispatch(controlChannelSet(channel));
      }
    });
  },
);

export const controlChannelSet = createAppThunk(
  "controlChannelSet",
  (dc: RTCDataChannel, { dispatch }) => {
    setControlChannel(dc);
    dc.addEventListener("message", (event: MessageEvent<string>) => {
      dispatch(appControlChannelMessage(JSON.parse(event.data)));
    });
  },
);

export const controlChannelSend = createAppThunk(
  "controlChannelSend",
  (msg: ControlChannelMessage) => {
    const dc = getControlChannel();
    dc.send(JSON.stringify(msg));
  },
);
