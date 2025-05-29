import { createAppThunk } from "../../shared/store/create-app-thunk";
import { OfferOrAnswer } from "../../entities/connection/types";
import { connectionSlice } from "../../entities/connection/slice";
import { getConnection } from "../../entities/connection/connection";
import { getStringMessageFromUnknownError } from "../../shared/error/get-string-message-from-unknown-error";

export const connectionServerSetAnswer = createAppThunk(
  "connectionServerSetAnswer",
  async (answer: OfferOrAnswer, { getState, dispatch }) => {
    const status = connectionSlice.selectors.status(getState());
    if (status != "CANDIDATES_FOUND") {
      throw new Error("wrong status");
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
  },
);
