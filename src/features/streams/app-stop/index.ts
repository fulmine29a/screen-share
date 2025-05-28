import { createAppThunk } from "../../../shared/store/create-app-thunk";
import { clearStreams, streams } from "../../../entities/streams/streams";
import { streamSlice } from "../../../entities/streams/slice";

export const streamsAppStop = createAppThunk(
  "streamsAppStop",
  (_, { dispatch }) => {
    for (const stream of Object.values(streams)) {
      stream.getTracks().forEach((track) => track.stop());
    }
    clearStreams();
    dispatch(streamSlice.actions.reset());
  },
);
