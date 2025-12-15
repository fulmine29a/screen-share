import { createAppThunk } from "../../shared/store/create-app-thunk";
import { getConnection } from "../../entities/connection/connection";
import { connectionSlice } from "../../entities/connection/slice";
import { errorSlice } from "../../entities/error/slice";
import { errorToAppError } from "../../shared/error/error-to-app-error";
import { appConnected } from "../app";

export const connectionSetStatusEventListener = createAppThunk(
  "connectionSetStatusEventListener",
  async (_, { dispatch, getState }) => {
    const connection = getConnection();
    connection.addEventListener("connectionstatechange", function () {
      console.assert(
        this == getConnection(),
        "connectionstatechange called on dead connection",
      );

      const oldStatus = connectionSlice.selectors.status(getState());
      try {
        switch (this.connectionState) {
          case "connected":
            dispatch(connectionSlice.actions.setConnected());
            if (oldStatus == "CANDIDATES_FOUND") {
              dispatch(appConnected());
            }
            break;
          case "disconnected":
            dispatch(connectionSlice.actions.setDisconnected());
            break;
          case "failed":
            dispatch(connectionSlice.actions.setFailed("connection lost"));
            break;
          case "closed":
            dispatch(connectionSlice.actions.setClosed());
        }
      } catch (e) {
        dispatch(
          errorSlice.actions.add(
            errorToAppError(e, "error in connectionstatechange handler"),
          ),
        );
      }
    });
  },
);
