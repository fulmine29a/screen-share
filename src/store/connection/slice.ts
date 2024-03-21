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
    setSearchCandidates: (
      state,
      { payload }: PayloadAction<RTCSessionDescriptionInit>,
    ) => {
      return {
        status: "SEARCH_FOR_CANDIDATES",
        localDescription: payload,
      };
    },
    setCandidatesFound: (
      state,
      { payload }: PayloadAction<RTCIceCandidateInit[]>,
    ) => {
      if (state.status != "SEARCH_FOR_CANDIDATES") {
        throw new Error("attempt to set candidates from the wrong status");
      }

      return {
        status: "CANDIDATES_FOUND",
        candidates: payload,
        localDescription: state.localDescription,
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
      (state.status == "SEARCH_FOR_CANDIDATES" ||
        state.status == "CANDIDATES_FOUND") &&
      state.localDescription,
    candidates: (state) =>
      state.status == "CANDIDATES_FOUND" && state.candidates,
  },
});
