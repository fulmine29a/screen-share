import { createAppThunk } from "../../shared/store/create-app-thunk";
import { getConnection } from "../../entities/connection/connection";
import { connectionSlice } from "../../entities/connection/slice";
import { errorSlice } from "../../entities/error/slice";
import { errorToAppError } from "../../shared/error/error-to-app-error";

export const connectionSetCandidatesEventListener = createAppThunk(
  "connectionSetCandidatesEventListener",
  async (_, { dispatch }) => {
    const connection = getConnection();
    connection.addEventListener(
      "icecandidate",
      function ({ candidate }: RTCPeerConnectionIceEvent) {
        try {
          if (!candidate) {
            dispatch(
              connectionSlice.actions.setCandidatesFound(this.localDescription),
            );
          }
        } catch (e) {
          dispatch(
            errorSlice.actions.add(
              errorToAppError(e, "error in icecandidate listener"),
            ),
          );
        }
      },
    );
  },
);
