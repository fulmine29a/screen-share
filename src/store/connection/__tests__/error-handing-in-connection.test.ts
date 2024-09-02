import { AppDispatch, createStore } from "../../store";
import { connectionSlice } from "../slice";
import {
  connectionCreateClient,
  connectionCreateServer,
  connectionServerSetAnswer,
} from "../thunks";
import { FAKE_ANSWER, FAKE_OFFER } from "../test-data";
import { deleteConnection, setConnection } from "../connection";
import { checkErrors } from "../../../utils/test-utils";
import { ConnectionStatus } from "../types";

const setInitialStatusCreated = (dispatch: AppDispatch) =>
  dispatch(connectionSlice.actions.setCreated());

describe.each([
  {
    thunk: connectionCreateServer,
    failMethods: ["setLocalDescription"],
    arg: undefined,
    setInitialStatus: setInitialStatusCreated,
  },
  {
    thunk: connectionCreateClient,
    failMethods: ["setLocalDescription", "setRemoteDescription"],
    arg: FAKE_OFFER,
    setInitialStatus: setInitialStatusCreated,
  },
  {
    thunk: connectionServerSetAnswer,
    failMethods: ["setRemoteDescription"],
    arg: FAKE_ANSWER,
    setInitialStatus: (dispatch) => {
      dispatch(connectionSlice.actions.setCreated());
      dispatch(connectionSlice.actions.setSearchCandidates());
      dispatch(connectionSlice.actions.setCandidatesFound(FAKE_OFFER));
    },
  },
])(
  "error handing in $thunk.typePrefix",
  ({ thunk, failMethods, arg, setInitialStatus }) => {
    test("connection is undefined", async () => {
      const store = createStore();
      store.dispatch(connectionSlice.actions.setCreated());
      deleteConnection();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await store.dispatch(thunk(arg));
      checkErrors(store, 1);
    });

    test("wrong status", async () => {
      const store = createStore();
      setConnection(new RTCPeerConnection());
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await store.dispatch(thunk(arg));
      checkErrors(store, 1);
    });

    test.each(failMethods)("exception in %s", async (method) => {
      const store = createStore();
      const connection = new RTCPeerConnection();
      const ERROR_MESSAGE = "error message";
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      connection[method] = async () => {
        throw new Error(ERROR_MESSAGE);
      };
      setConnection(connection);
      setInitialStatus(store.dispatch);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await store.dispatch(thunk(arg));
      checkErrors(store, 0);
      expect(
        connectionSlice.selectors.status(store.getState()),
      ).toBe<ConnectionStatus>("FAILED");
      expect(connectionSlice.selectors.failReason(store.getState())).toBe(
        ERROR_MESSAGE,
      );
    });
  },
);
