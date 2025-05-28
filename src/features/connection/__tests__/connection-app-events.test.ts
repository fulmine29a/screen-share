import { createAppStore } from "../../../app/store";
import { createAppThunk } from "../../../shared/store/create-app-thunk";
import {
  deleteConnection,
  getConnection,
  hasConnection,
  setConnection,
} from "../../../entities/connection/connection";
import { connectionAppStart, connectionAppStop } from "../index";
import { checkErrors } from "../../../shared/test-utils/check-errors";
import { connectionSlice } from "../../../entities/connection/slice";
import { ConnectionStatus } from "../../../entities/connection/types";
import { appConnectionCreated } from "../../app";

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
    expect(appConnectionCreated).toHaveBeenCalledTimes(1);
    expect(connectionInConnectionCreated).toBe(getConnection());
    expect(connectionSlice.selectors.failReason(store.getState())).toBeFalsy();
  });

  test("close", async () => {
    const store = createAppStore();
    setConnection(new RTCPeerConnection());
    store.dispatch(connectionSlice.actions.setFailed("test fail"));

    await store.dispatch(connectionAppStop());

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

    await store.dispatch(connectionAppStop());

    checkErrors(store, 0);
  });
});
