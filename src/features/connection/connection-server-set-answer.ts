import { createAppThunk } from "../../shared/store/create-app-thunk";
import { OfferOrAnswer } from "../../entities/connection/types";
import { connectionSlice } from "../../entities/connection/slice";
import { getConnection } from "../../entities/connection/connection";
import { getStringMessageFromUnknownError } from "../../shared/error/get-string-message-from-unknown-error";
import { cantRunParallel } from "../../shared/cant-run-parallel";

export const connectionServerSetAnswer = createAppThunk(
  "connectionServerSetAnswer",
  cantRunParallel(async (answer: OfferOrAnswer, { getState, dispatch }) => {
    const status = connectionSlice.selectors.status(getState()),
      role = connectionSlice.selectors.role(getState());
    if (status != "CANDIDATES_FOUND") {
      throw new Error("wrong status");
    }

    if (role != "SERVER") {
      throw new Error("wrong role");
    }

    const connection = getConnection();

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
  }),
);
