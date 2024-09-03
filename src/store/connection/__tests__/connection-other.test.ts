import { createStore } from "../../store";
import {
  connectionServerSetAnswer,
  connectionSetCandidatesEventListener,
  connectionSetStatusEventListener,
} from "../thunks";
import { setConnection } from "../connection";
import { connectionSlice } from "../slice";
import { ConnectionState, ConnectionStatus } from "../types";
import { checkErrors, runOnce } from "../../../utils/test-utils";
import { CANDIDATES, FAKE_ANSWER, FAKE_OFFER } from "../test-data";

describe("connectionSetCandidatesEventListener", () => {
  test("normal flow", async () => {
    const connection = new RTCPeerConnection();
    setConnection(connection);
    const store = createStore();
    store.dispatch(connectionSlice.actions.setCreated());
    await store.dispatch(connectionSetCandidatesEventListener());
    store.dispatch(connectionSlice.actions.setSearchCandidates());
    for (const candidate of CANDIDATES) {
      const event = new RTCPeerConnectionIceEvent("icecandidate", {
        candidate: new RTCIceCandidate(candidate),
      });
      connection.dispatchEvent(event);
    }
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("SEARCH_FOR_CANDIDATES");
    await connection.setLocalDescription(FAKE_OFFER);
    const event = new RTCPeerConnectionIceEvent("icecandidate", {
      candidate: null,
    });
    connection.dispatchEvent(event);
    checkErrors(store, 0);
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("CANDIDATES_FOUND");
  });

  test("error handling", async () => {
    const connection = new RTCPeerConnection();
    setConnection(connection);
    const store = createStore();
    store.dispatch(connectionSlice.actions.setCreated());
    await store.dispatch(connectionSetCandidatesEventListener());
    const event = new RTCPeerConnectionIceEvent("icecandidate", {
      candidate: null,
    });
    connection.dispatchEvent(event);

    checkErrors(store, 1);
  });
});

describe("connectionSetStatusEventListener", () => {
  const expectedStatusMap: [
    RTCPeerConnectionState,
    ConnectionState["status"],
  ][] = [
    ["connecting", "CANDIDATES_FOUND"],
    ["connected", "CONNECTED"],
    ["disconnected", "DISCONNECTED"],
    ["failed", "FAILED"],
    ["closed", "CLOSED"],
  ];

  const run = runOnce(() => {
    const store = createStore();
    const connection = new RTCPeerConnection();
    setConnection(connection);
    store.dispatch(connectionSetStatusEventListener());
    store.dispatch(connectionSlice.actions.setSearchCandidates());
    store.dispatch(
      connectionSlice.actions.setCandidatesFound(JSON.stringify(FAKE_OFFER)),
    );

    const res = {} as Record<RTCPeerConnectionState, ConnectionState["status"]>;

    for (const [status] of expectedStatusMap) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      connection.connectionState = status;
      const event = new Event("connectionstatechange");
      connection.dispatchEvent(event);
      res[status] = connectionSlice.selectors.status(store.getState());
    }

    checkErrors(store, 0);
    return res;
  });

  test.each(expectedStatusMap)(
    "on status %s must be %s",
    (connectionStatus, sliceState) => {
      const resultMap = run();
      expect(resultMap[connectionStatus]).toBe(sliceState);
    },
  );

  test("connectionSetStatusEventListener error handing", () => {
    const store = createStore();
    const connection = new RTCPeerConnection();
    setConnection(connection);
    store.dispatch(connectionSetStatusEventListener());

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete connection.connectionState;
    Object.defineProperty(connection, "connectionState", {
      get() {
        throw new Error("test error");
      },
    });

    const event = new Event("connectionstatechange");
    connection.dispatchEvent(event);

    checkErrors(store, 1);
  });

  test("connectionSetStatusEventListener reconnect", () => {
    const store = createStore();
    const connection = new RTCPeerConnection();
    setConnection(connection);
    store.dispatch(connectionSetStatusEventListener());
    store.dispatch(connectionSlice.actions.setSearchCandidates());
    store.dispatch(
      connectionSlice.actions.setCandidatesFound(JSON.stringify(FAKE_OFFER)),
    );
    store.dispatch(connectionSlice.actions.setConnected());

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    connection.connectionState = "disconnected";
    const disconnectEvent = new Event("connectionstatechange");
    connection.dispatchEvent(disconnectEvent);

    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("DISCONNECTED");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    connection.connectionState = "connected";
    const connectedEvent = new Event("connectionstatechange");
    connection.dispatchEvent(connectedEvent);

    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("CONNECTED");

    checkErrors(store, 0);
  });
});

describe("connectionServerSetAnswer", () => {
  test("normal", async () => {
    const store = createStore();
    const connection = new RTCPeerConnection();
    const setRemoteDescription = jest.fn(async () => undefined);
    connection.setRemoteDescription = setRemoteDescription;
    setConnection(connection);
    store.dispatch(connectionSlice.actions.setCreated());
    store.dispatch(connectionSlice.actions.setSearchCandidates());
    store.dispatch(
      connectionSlice.actions.setCandidatesFound(JSON.stringify(FAKE_OFFER)),
    );
    await store.dispatch(connectionServerSetAnswer(FAKE_ANSWER));
    checkErrors(store, 0);
    expect(setRemoteDescription).toHaveBeenCalledWith(FAKE_ANSWER);
  });
});