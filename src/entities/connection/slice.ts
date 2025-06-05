import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConnectionRole, ConnectionState } from "./types";

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
      { payload }: PayloadAction<ConnectionRole>,
    ) => {
      return {
        status: "SEARCH_FOR_CANDIDATES",
        role: payload,
      } as const;
    },
    setCandidatesFound: (state, { payload }: PayloadAction<string | null>) => {
      if (state.status != "SEARCH_FOR_CANDIDATES") {
        throw new Error("attempt to set candidates from the wrong status");
      }
      if (!payload) {
        throw new Error("attempt to set empty local sdp");
      }

      return {
        status: "CANDIDATES_FOUND",
        role: state.role,
        localDescription: payload,
      };
    },
    setConnected: () => ({ status: "CONNECTED" }) as const,
    setDisconnected: () => ({ status: "DISCONNECTED" }) as const,
    setFailed: (state, { payload }: PayloadAction<string>) => {
      return {
        status: "FAILED",
        failReason: payload,
      };
    },
    setClosed: () => ({ status: "CLOSED" }) as const,
  },
  selectors: {
    status: (state) => state.status,
    failReason: (state) => state.status == "FAILED" && state.failReason,
    localDescription: (state) =>
      state.status == "CANDIDATES_FOUND" && state.localDescription,
    role: (state) => {
      if (
        state.status == "SEARCH_FOR_CANDIDATES" ||
        state.status == "CANDIDATES_FOUND"
      ) {
        return state.role;
      }
      throw new Error("it is impossible to get a role in this status");
    },
  },
});
