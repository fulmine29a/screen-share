import { createAppThunk, createStore } from "../../../shared/store/store";
import {
  connection,
  deleteConnection,
  setConnection,
} from "../../../entities/connection/connection";
import { connectionAppStart, connectionAppStop } from "../index";
import { checkErrors } from "../../../shared/test-utils";
import { connectionSlice } from "../../../entities/connection/slice";
import { ConnectionStatus } from "../../../entities/connection/types";
import { appConnectionCreated, appRemoveConnectionListeners } from "../../app";

let connectionInConnectionCreated: RTCPeerConnection | undefined;
let connectionInRemoveListeners: RTCPeerConnection | undefined;

jest.mock("../../app", () => {
  const originalModule = jest.requireActual("../../app");

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
