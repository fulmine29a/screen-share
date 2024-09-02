import { createAppThunk, createStore } from "../../store";
import { connection, deleteConnection, setConnection } from "../connection";
import { connectionAppStart, connectionAppStop } from "../thunks";
import { checkErrors } from "../../../utils/test-utils";
import { connectionSlice } from "../slice";
import { ConnectionStatus } from "../types";
import {
  appConnectionCreated,
  appRemoveConnectionListeners,
} from "../../app-events";

let connectionInConnectionCreated: RTCPeerConnection | undefined;
let connectionInRemoveListeners: RTCPeerConnection | undefined;

jest.mock("../../app-events", () => {
  const originalModule = jest.requireActual("../../app-events");

  const appConnectionCreated = jest.fn(
    createAppThunk("appConnectionCreated", () => {
      connectionInConnectionCreated = connection;
    }),
  );

  const appRemoveConnectionListeners = jest.fn(
    createAppThunk("appRemoveConnectionListeners", () => {
      connectionInRemoveListeners = connection;
    }),
  );

  return {
    __esModule: true,
    ...originalModule,
    appConnectionCreated,
    appRemoveConnectionListeners,
  };
});

describe("create/close", () => {
  test("create on appStart", async () => {
    connectionInConnectionCreated = undefined;
    const store = createStore();
    await store.dispatch(connectionAppStart());
    checkErrors(store, 0);
    expect(connection).toBeInstanceOf(RTCPeerConnection);
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("CREATED");
    expect(appConnectionCreated).toHaveBeenCalledTimes(1);
    expect(connectionInConnectionCreated).toBe(connection);
    expect(connectionSlice.selectors.failReason(store.getState())).toBeFalsy();
  });

  test("close", async () => {
    connectionInRemoveListeners = undefined;
    const store = createStore();
    setConnection(new RTCPeerConnection());
    store.dispatch(connectionSlice.actions.setFailed("test fail"));
    await store.dispatch(connectionAppStop());
    checkErrors(store, 0);
    expect(appRemoveConnectionListeners).toHaveBeenCalledTimes(1);
    expect(connectionInRemoveListeners).toBeInstanceOf(RTCPeerConnection);
    expect(connectionInRemoveListeners!.connectionState).toBe("closed");
    expect(connection).toBeFalsy();
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("NOT_INITIALIZED");
    expect(connectionSlice.selectors.failReason(store.getState())).toBeFalsy();
  });

  test("close uninitialized connection", async () => {
    const store = createStore();
    deleteConnection();
    await store.dispatch(connectionAppStop());
    expect(appRemoveConnectionListeners).not.toHaveBeenCalled();
    checkErrors(store, 0);
  });
});
