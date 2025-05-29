import { createAppThunk } from "../../shared/store/create-app-thunk";
import {
  getConnection,
  setConnection,
} from "../../entities/connection/connection";
import { connectionSlice } from "../../entities/connection/slice";
import { appConnectionCreated } from "../app";
import { negotiationNeededHandler } from "./negotiation-needed-handler";

export const connectionAppStart = createAppThunk(
  "connectionAppStart",
  async (_, { dispatch }) => {
    setConnection(
      new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      }),
    );
    getConnection().addEventListener(
      "negotiationneeded",
      negotiationNeededHandler(dispatch),
    );

    dispatch(connectionSlice.actions.setCreated());
    await dispatch(appConnectionCreated());
  },
);
