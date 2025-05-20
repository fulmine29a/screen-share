import { createAppThunk } from "../../shared/store/store";
import { streams } from "../../entities/streams/streams";
import { StreamDirection, StreamRecord } from "../../entities/streams/types";
import { streamSlice } from "../../entities/streams/slice";

type StreamAddPayload = {
  stream: MediaStream;
  direction: StreamDirection;
  label: string;
};

export const streamsAdd = createAppThunk(
  "streamsAdd",
  ({ stream, direction, label }: StreamAddPayload, { dispatch }) => {
    streams[stream.id] = stream;
    dispatch(streamSlice.actions.add({ id: stream.id, direction, label }));
  },
);

export const streamsRemove = createAppThunk(
  "streamsRemove",
  (id: StreamRecord["id"], { dispatch }) => {
    delete streams[id];
    dispatch(streamSlice.actions.remove(id));
  },
);

export const streamsCaptureScreen = createAppThunk(
  "streamsCaptureScreen",
  async (_, { dispatch }) => {
    const displayMediaStream = await navigator.mediaDevices.getDisplayMedia();

    streams[displayMediaStream.id] = displayMediaStream;
    dispatch(
      streamSlice.actions.add({
        id: displayMediaStream.id,
        direction: "out",
        label: "Screen",
      }),
    );
  },
);
