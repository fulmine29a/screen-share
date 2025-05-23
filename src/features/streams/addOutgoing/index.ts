import { streamSlice } from "../../../entities/streams/slice";
import { streams } from "../../../entities/streams/streams";
import { createAppThunk } from "../../../shared/store/create-app-thunk";

type Params = {
  stream: MediaStream;
  label: string;
};

export const streamsAddOutgoing = createAppThunk(
  "streamsAddOutgoing",
  ({ stream, label }: Params, { dispatch }) => {
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
