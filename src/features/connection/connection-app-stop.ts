import { createAppThunk } from "../../shared/store/create-app-thunk";
import {
  deleteConnection,
  getConnection,
  hasConnection,
} from "../../entities/connection/connection";
import { connectionSlice } from "../../entities/connection/slice";

export const connectionAppStop = createAppThunk(
  "connectionAppStop",
  async (_, { dispatch }) => {
    if (hasConnection()) {
      const connection = getConnection();
      connection.close();
      dispatch(connectionSlice.actions.reset());
      deleteConnection();
    }
  },
);
