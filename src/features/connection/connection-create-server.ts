import { createAppThunk } from "../../shared/store/create-app-thunk";
import { connectionSlice } from "../../entities/connection/slice";
import { CONTROL_DATACHANNEL } from "../../entities/control-channel/control-channel";
import { getStringMessageFromUnknownError } from "../../shared/error/get-string-message-from-unknown-error";
import { controlChannelSet } from "../control-channel";
import { getConnection } from "../../entities/connection/connection";
import { cantRunParallel } from "../../shared/cant-run-parallel";

export const connectionCreateServer = createAppThunk(
  "connectionCreateServer",
  cantRunParallel(async (_: undefined, { dispatch, getState }) => {
    const status = connectionSlice.selectors.status(getState());
    if (status != "CREATED") {
      throw new Error("wrong status");
    }
    const connection = getConnection();

    try {
      const dc = connection.createDataChannel(CONTROL_DATACHANNEL);

      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      dispatch(connectionSlice.actions.setSearchCandidates("SERVER"));
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
  }),
);
