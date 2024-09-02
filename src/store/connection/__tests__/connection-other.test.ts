import { createStore } from "../../store";
import {
  connectionServerSetAnswer,
  connectionSetCandidatesEventListener,
  connectionSetStatusEventListener,
} from "../thunks";
import { setConnection } from "../connection";
import { connectionSlice } from "../slice";
import { ConnectionStatus } from "../types";
import { checkErrors } from "../../../utils/test-utils";
import { CANDIDATES, FAKE_ANSWER, FAKE_OFFER } from "../test-data";

describe("connectionSetCandidatesEventListener", () => {
  test("normal flow", async () => {
    const connection = new RTCPeerConnection();
    setConnection(connection);
    const store = createStore();
    store.dispatch(connectionSlice.actions.setCreated());
    await store.dispatch(connectionSetCandidatesEventListener());
    store.dispatch(connectionSlice.actions.setSearchCandidates());
    for (const { candidate } of CANDIDATES) {
      const event = new RTCPeerConnectionIceEvent("icecandidate", {
        candidate: new RTCIceCandidate({ candidate }),
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
});

describe("connectionSetStatusEventListener", () => {
  test("connecting", async () => {
    const store = createStore();
    const connection = new RTCPeerConnection();
    setConnection(connection);
    store.dispatch(connectionSetStatusEventListener());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    connection.connectionState = "connecting";
    const event = new Event("connectionstatechange");
    connection.dispatchEvent(event);
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("NOT_INITIALIZED");
  });

  test("connected", async () => {
    const store = createStore();
    const connection = new RTCPeerConnection();
    setConnection(connection);
    store.dispatch(connectionSetStatusEventListener());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    connection.connectionState = "connected";
    const event = new Event("connectionstatechange");
    connection.dispatchEvent(event);
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("CONNECTED");
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
    store.dispatch(connectionSlice.actions.setCandidatesFound(FAKE_OFFER));
    await store.dispatch(connectionServerSetAnswer(FAKE_ANSWER));
    checkErrors(store, 0);
    expect(setRemoteDescription).toHaveBeenCalledWith(FAKE_ANSWER);
  });
});
