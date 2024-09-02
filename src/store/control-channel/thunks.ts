import { createAppThunk } from "../store";

export const controlChannelSet = createAppThunk(
  "controlChannelSet",
  async (channel: RTCDataChannel) => {
    console.log(channel);
  },
);
