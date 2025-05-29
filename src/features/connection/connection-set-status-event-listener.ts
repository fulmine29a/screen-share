import { createAppThunk } from "../../shared/store/create-app-thunk";
import { getConnection } from "../../entities/connection/connection";
import { connectionSlice } from "../../entities/connection/slice";
import { errorSlice } from "../../entities/error/slice";
import { errorToAppError } from "../../shared/error/error-to-app-error";

export const connectionSetStatusEventListener = createAppThunk(
  "connectionSetStatusEventListener",
  async (_, { dispatch }) => {
    const connection = getConnection();
    connection.addEventListener("connectionstatechange", function () {
      try {
        switch (this.connectionState) {
          case "connected":
            dispatch(connectionSlice.actions.setConnected());
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
