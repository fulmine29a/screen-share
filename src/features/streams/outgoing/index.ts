import { streamSlice } from "../../../entities/streams/slice";
import { streams } from "../../../entities/streams/streams";
import { createAppThunk } from "../../../shared/store/create-app-thunk";
import { getConnection } from "../../../entities/connection/connection";

type Params = {
  stream: MediaStream;
  label: string;
};

export const streamsSendOutgoing = createAppThunk(
  "streamsSendOutgoing",
  async ({ stream, label }: Params, { dispatch }) => {
    const connection = getConnection();

    for (const track of stream.getTracks()) {
      connection.addTrack(track, stream);
    }

    streams[stream.id] = stream;
    dispatch(
      streamSlice.actions.add({
        id: stream.id,
        direction: "out",
        label,
      }),
    );
  },
);
