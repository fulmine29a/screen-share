import { getConnection } from "../../../entities/connection/connection";
import { streams } from "../../../entities/streams/streams";
import { streamSlice } from "../../../entities/streams/slice";
import { createAppThunk } from "../../../shared/store/create-app-thunk";
import { AppDispatch } from "../../../app/store";

export const trackHandlerCreate =
  (dispatch: AppDispatch) => (event: RTCTrackEvent) => {
    if (event.streams.length != 1) {
      throw new Error("The number of streams is not 1");
    }

    const stream = event.streams[0];
    if (!streams[stream.id]) {
      streams[stream.id] = stream;
      dispatch(
        streamSlice.actions.add({
          id: stream.id,
          direction: "in",
          label: "incoming stream",
        }),
      );
    }
  };

let handleTrackEvent: (event: RTCTrackEvent) => void;

export const streamsIncomingConnectionCreated = createAppThunk(
  "streamsIncomingConnectionCreated",
  async (_, { dispatch }) => {
    handleTrackEvent = trackHandlerCreate(dispatch);

    const connection = getConnection();
    connection.addEventListener("track", handleTrackEvent);
  },
);

export const streamsIncomingConnectionAppStop = createAppThunk(
  "streamsIncomingConnectionAppStop",
  async () => {
    const connection = getConnection();
    connection.removeEventListener("track", handleTrackEvent);
  },
);
