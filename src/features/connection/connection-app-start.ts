import { createAppThunk } from "../../shared/store/create-app-thunk";
import {
  getConnection,
  setConnection,
} from "../../entities/connection/connection";
import { connectionSlice } from "../../entities/connection/slice";
import { appConnectionCreated } from "../app";
import { negotiationNeededHandler } from "./negotiation-needed-handler";
import { getStringMessageFromUnknownError } from "../../shared/error/get-string-message-from-unknown-error";

export const connectionAppStart = createAppThunk(
  "connectionAppStart",
  async (_, { dispatch, getState }) => {
    if (connectionSlice.selectors.status(getState()) != "NOT_INITIALIZED") {
      throw new Error("wrong status");
    }
    try {
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
    } catch (e) {
      dispatch(
        connectionSlice.actions.setFailed(
          getStringMessageFromUnknownError(
            e,
            "unknown error during client creation",
          ),
        ),
      );
    }
  },
);
