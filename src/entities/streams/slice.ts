import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StreamRecord, StreamState } from "./types";

const initialState: StreamState = {
  streams: [],
};

export const streamSlice = createSlice({
  name: "streams",
  initialState,
  reducers: {
    add(state, { payload }: PayloadAction<StreamRecord>) {
      state.streams.push(payload);
    },
    remove(state, { payload }: PayloadAction<StreamRecord["id"]>) {
      state.streams = state.streams.filter(({ id }) => id != payload);
    },
  },
  selectors: {
    incomingStreams: (state) =>
      state.streams.filter(({ direction }) => direction == "in"),
    outgoingStreams: (state) =>
      state.streams.filter(({ direction }) => direction == "out"),
  },
});
