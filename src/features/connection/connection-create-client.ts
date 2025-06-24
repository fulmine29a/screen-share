import { createAppThunk } from "../../shared/store/create-app-thunk";
import { OfferOrAnswer } from "../../entities/connection/types";
import { connectionSlice } from "../../entities/connection/slice";
import { getConnection } from "../../entities/connection/connection";
import { getStringMessageFromUnknownError } from "../../shared/error/get-string-message-from-unknown-error";
import { cantRunParallel } from "../../shared/cant-run-parallel";

export const connectionCreateClient = createAppThunk(
  "connectionCreateClient",
  cantRunParallel(async (offer: OfferOrAnswer, { dispatch, getState }) => {
    const status = connectionSlice.selectors.status(getState());
    if (status != "CREATED") {
      throw new Error("wrong status");
    }
    const connection = getConnection();

    try {
      await connection.setRemoteDescription(offer);
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);

      dispatch(connectionSlice.actions.setSearchCandidates("CLIENT"));
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
  }),
);
