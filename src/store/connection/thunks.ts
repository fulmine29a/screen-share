import { createAppThunk } from "../store";
import { connection, deleteConnection, setConnection } from "./connection";
import { connectionSlice } from "./slice";
import {
  appConnectionCreated,
  appRemoveConnectionListeners,
} from "../app-events";
import { getStringMessageFromUnknownError } from "../../utils/getStringMessageFromUnknownError";
import { OfferOrAnswer } from "./types";
import { controlChannelSet } from "../control-channel/thunks";

export const CONTROL_DATACHANNEL = "control-datachannel";

export const connectionAppStart = createAppThunk(
  "connectionAppStart",
  async (_, { dispatch }) => {
    setConnection(
      new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      }),
    );

    dispatch(connectionSlice.actions.setCreated());
    dispatch(appConnectionCreated());
  },
);

export const connectionCreateServer = createAppThunk(
  "connectionCreateServer",
  async (_, { dispatch, getState }) => {
    const status = connectionSlice.selectors.status(getState());
    if (status != "CREATED") {
      throw new Error("wrong status");
    }
    if (!connection) {
      throw new Error("connection is required to create a server");
    }

    try {
      const dc = connection.createDataChannel(CONTROL_DATACHANNEL);

      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      dispatch(connectionSlice.actions.setSearchCandidates());
      dispatch(controlChannelSet(dc));
    } catch (e) {
      dispatch(
        connectionSlice.actions.setFailed(
          getStringMessageFromUnknownError(
            e,
            "unknown error during server creation",
          ),
        ),
      );
    }
  },
);

export const connectionServerSetAnswer = createAppThunk(
  "connectionServerSetAnswer",
  async (answer: OfferOrAnswer, { getState, dispatch }) => {
    const status = connectionSlice.selectors.status(getState());
    if (status != "CANDIDATES_FOUND") {
      throw new Error("wrong status");
    }
    if (!connection) {
      throw new Error("connection is required to create a server");
    }

    try {
      await connection.setRemoteDescription(answer);
    } catch (e) {
      dispatch(
        connectionSlice.actions.setFailed(
          getStringMessageFromUnknownError(
            e,
            "unknown error during set answer",
          ),
        ),
      );
    }
  },
);

export const connectionCreateClient = createAppThunk(
  "connectionCreateClient",
  async (offer: OfferOrAnswer, { dispatch, getState }) => {
    const status = connectionSlice.selectors.status(getState());
    if (status != "CREATED") {
      throw new Error("wrong status");
    }
    if (!connection) {
      throw new Error("connection is required to create a client");
    }

    try {
      await connection.setRemoteDescription(offer);
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);

      dispatch(connectionSlice.actions.setSearchCandidates());
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

export const connectionSetCandidatesEventListener = createAppThunk(
  "connectionSetCandidatesEventListener",
  async (_, { dispatch }) => {
    if (!connection) {
      throw new Error(
        "connection is required to set candidates event listener",
      );
    }

    connection.addEventListener(
      "icecandidate",
      function ({ candidate }: RTCPeerConnectionIceEvent) {
        if (!candidate) {
          dispatch(
            connectionSlice.actions.setCandidatesFound(this.localDescription),
          );
        }
      },
    );
  },
);

export const connectionSetStatusEventListener = createAppThunk(
  "connectionSetStatusEventListener",
  async (_, { dispatch }) => {
    if (!connection) {
      throw new Error("connection is required to set status event listener");
    }

    connection.addEventListener("connectionstatechange", function () {
      if (this.connectionState == "connected") {
        dispatch(connectionSlice.actions.setConnected());
      }
    });
  },
);

export const connectionAppStop = createAppThunk(
  "connectionAppStop",
  async (_, { dispatch }) => {
    if (connection) {
      connection.close();
      dispatch(appRemoveConnectionListeners());
      dispatch(connectionSlice.actions.reset());
      deleteConnection();
    }
  },
);
