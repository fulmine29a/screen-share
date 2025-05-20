import { createAppThunk } from "../../shared/store/store";

export const controlChannelSet = createAppThunk(
  "controlChannelSet",
  async (channel: RTCDataChannel) => {
    console.log(channel);
  },
);
