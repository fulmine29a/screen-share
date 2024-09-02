import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConnectionState } from "./types";

const initialState: ConnectionState = {
  status: "NOT_INITIALIZED",
};

export const connectionSlice = createSlice({
  name: "connection",
  initialState: initialState as ConnectionState,
  reducers: {
    reset: () => {
      return initialState;
    },
    setCreated: () => {
      return { status: "CREATED" as const };
    },
    setSearchCandidates: () => {
      return {
        status: "SEARCH_FOR_CANDIDATES" as const,
      };
    },
    setCandidatesFound: (
      state,
      { payload }: PayloadAction<RTCSessionDescriptionInit | null>,
    ) => {
      if (state.status != "SEARCH_FOR_CANDIDATES") {
        throw new Error("attempt to set candidates from the wrong status");
      }
      if (!payload) {
        throw new Error("attempt to set empty local sdp");
      }

      return {
        status: "CANDIDATES_FOUND",
        localDescription: payload,
      };
    },
    setConnected: () => ({ status: "CONNECTED" }) as const,
    setFailed: (state, { payload }: PayloadAction<string>) => {
      return {
        status: "FAILED",
        failReason: payload,
      };
    },
  },
  selectors: {
    status: (state) => state.status,
    failReason: (state) => state.status == "FAILED" && state.failReason,
    localDescription: (state) =>
      state.status == "CANDIDATES_FOUND" && state.localDescription,
  },
});
