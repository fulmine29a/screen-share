import { createAppStore } from "../../../app/store";
import { createAppThunk } from "../../../shared/store/create-app-thunk";
import {
  deleteConnection,
  getConnection,
  hasConnection,
  setConnection,
} from "../../../entities/connection/connection";
import { checkErrors } from "../../../shared/test-utils/check-errors";
import { connectionSlice } from "../../../entities/connection/slice";
import { ConnectionStatus } from "../../../entities/connection/types";

import { connectionAppStop } from "../connection-app-stop";
import { connectionAppStart } from "../connection-app-start";

let connectionInConnectionCreated: RTCPeerConnection | undefined;

jest.mock("../../app", () => {
  const originalModule = jest.requireActual("../../app");

  const appConnectionCreated = jest.fn(
    createAppThunk("appConnectionCreated", () => {
      connectionInConnectionCreated = getConnection();
    }),
  );

  return {
    __esModule: true,
    ...originalModule,
    appConnectionCreated,
  };
});

describe("create/close", () => {
  test("create on appStart", async () => {
    connectionInConnectionCreated = undefined;
    const store = createAppStore();

    await store.dispatch(connectionAppStart());

    checkErrors(store, 0);
    expect(getConnection()).toBeInstanceOf(RTCPeerConnection);
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("CREATED");
    expect(connectionInConnectionCreated).toBe(getConnection());
    expect(connectionSlice.selectors.failReason(store.getState())).toBeFalsy();
  });

  test("create with wrong status", async () => {
    connectionInConnectionCreated = undefined;
    const store = createAppStore();
    store.dispatch(connectionSlice.actions.setCreated());

    expect(() =>
      store.dispatch(connectionAppStart()).unwrap(),
    ).rejects.toBeTruthy();
    expect(connectionSlice.selectors.failReason(store.getState())).toBeFalsy();
  });

  test("close", async () => {
    const store = createAppStore();
    deleteConnection();
    setConnection(new RTCPeerConnection());
    store.dispatch(connectionSlice.actions.setFailed("test fail"));

    await store.dispatch(connectionAppStop()).unwrap();

    checkErrors(store, 0);
    expect(hasConnection()).toBeFalsy();
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("NOT_INITIALIZED");
    expect(connectionSlice.selectors.failReason(store.getState())).toBeFalsy();
  });

  test("close uninitialized connection", async () => {
    const store = createAppStore();
    deleteConnection();

    await store.dispatch(connectionAppStop()).unwrap();

    checkErrors(store, 0);
  });
});
