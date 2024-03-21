import { AppDispatch, AppStore, createAppThunk, createStore } from "../store";
import {
  connectionAppStart,
  connectionAppStop,
  connectionCreateClient,
  connectionCreateServer,
  connectionServerSetAnswer,
  connectionSetCandidatesEventListener,
  connectionSetStatusEventListener,
} from "./thunks";
import { connection, deleteConnection, setConnection } from "./connection";
import { connectionSlice } from "./slice";
import { ConnectionStatus, OfferOrAnswer } from "./types";
import {
  appConnectionCreated,
  appRemoveConnectionListeners,
} from "../app-events";
import { errorSlice } from "../error/slice";
import Mock = jest.Mock;

let connectionInConnectionCreated: RTCPeerConnection | undefined;
let connectionInRemoveListeners: RTCPeerConnection | undefined;

jest.mock("../app-events", () => {
  const originalModule = jest.requireActual("../app-events");

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

const FAKE_OFFER: OfferOrAnswer = {
  description: {
    type: "offer",
    sdp: "sdp-for-test-offer",
  },
  candidates: [
    {
      candidate: "3.3.3.3",
    },
  ],
};

const FAKE_ANSWER: OfferOrAnswer = {
  description: {
    type: "answer",
    sdp: "sdp-for-test-answer",
  },
  candidates: [
    {
      candidate: "8.8.8.8",
    },
  ],
};

const checkErrors = (store: AppStore, expectedErrors: number) => {
  const errors = errorSlice.selectors.errors(store.getState());
  expect(errors).toHaveLength(expectedErrors);
};

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
    failMethods: [
      "setLocalDescription",
      "setRemoteDescription",
      "addIceCandidate",
    ],
    arg: FAKE_OFFER,
    setInitialStatus: setInitialStatusCreated,
  },
  {
    thunk: connectionServerSetAnswer,
    failMethods: ["setRemoteDescription", "addIceCandidate"],
    arg: FAKE_ANSWER,
    setInitialStatus: (dispatch) => {
      dispatch(connectionSlice.actions.setCreated());
      dispatch(
        connectionSlice.actions.setSearchCandidates(FAKE_OFFER.description),
      );
      dispatch(
        connectionSlice.actions.setCandidatesFound(FAKE_OFFER.candidates),
      );
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

describe("connectionCreateServer", () => {
  test("create server", async () => {
    const connection = new RTCPeerConnection();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    connection.createOffer = jest.fn(async () => FAKE_OFFER.description);
    connection.setLocalDescription = jest.fn(async () => undefined);
    setConnection(connection);
    const store = createStore();
    store.dispatch(connectionSlice.actions.setCreated());
    await store.dispatch(connectionCreateServer());
    checkErrors(store, 0);
    expect(connection.createOffer).toHaveBeenCalled();
    expect(connection.setLocalDescription).toHaveBeenCalledWith(
      FAKE_OFFER.description,
    );
    expect(connectionSlice.selectors.localDescription(store.getState())).toBe(
      FAKE_OFFER.description,
    );
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("SEARCH_FOR_CANDIDATES");
  });
});

describe("connectionCreateClient", () => {
  test("create client", async () => {
    const connection = new RTCPeerConnection();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    connection.createAnswer = jest.fn(async () => FAKE_ANSWER.description);
    connection.setLocalDescription = jest.fn(async () => undefined);
    connection.setRemoteDescription = jest.fn(async () => undefined);
    setConnection(connection);
    const store = createStore();
    store.dispatch(connectionSlice.actions.setCreated());
    await store.dispatch(connectionCreateClient(FAKE_OFFER));
    checkErrors(store, 0);
    expect(connection.createAnswer).toHaveBeenCalled();
    expect(connection.setRemoteDescription).toHaveBeenCalledWith(
      FAKE_OFFER.description,
    );
    expect(connection.setLocalDescription).toHaveBeenCalledWith(
      FAKE_ANSWER.description,
    );
    for (const { candidate } of FAKE_OFFER.candidates) {
      expect(
        (connection.addIceCandidate as Mock).mock.calls.some(
          (call) => call[0].candidate == candidate,
        ),
      ).toBeTruthy();
    }
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("SEARCH_FOR_CANDIDATES");
  });
});

describe("connectionSetCandidatesEventListener", () => {
  test("normal flow", async () => {
    const connection = new RTCPeerConnection();
    setConnection(connection);
    const store = createStore();
    store.dispatch(connectionSlice.actions.setCreated());
    await store.dispatch(connectionSetCandidatesEventListener());
    store.dispatch(
      connectionSlice.actions.setSearchCandidates(FAKE_OFFER.description),
    );
    for (const { candidate } of FAKE_OFFER.candidates) {
      const event = new RTCPeerConnectionIceEvent("icecandidate", {
        candidate: new RTCIceCandidate({ candidate }),
      });
      connection.dispatchEvent(event);
    }
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("SEARCH_FOR_CANDIDATES");
    const event = new RTCPeerConnectionIceEvent("icecandidate", {
      candidate: null,
    });
    connection.dispatchEvent(event);
    checkErrors(store, 0);
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("CANDIDATES_FOUND");
    expect(
      connectionSlice.selectors.candidates(store.getState()),
    ).toStrictEqual(FAKE_OFFER.candidates);
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
    store.dispatch(
      connectionSlice.actions.setSearchCandidates(FAKE_OFFER.description),
    );
    store.dispatch(
      connectionSlice.actions.setCandidatesFound(FAKE_OFFER.candidates),
    );
    await store.dispatch(connectionServerSetAnswer(FAKE_ANSWER));
    checkErrors(store, 0);
    expect(setRemoteDescription).toHaveBeenCalledWith(FAKE_ANSWER.description);
    for (const { candidate } of FAKE_ANSWER.candidates) {
      expect(
        (connection.addIceCandidate as Mock).mock.calls.some(
          (call) => call[0].candidate == candidate,
        ),
      ).toBeTruthy();
    }
  });
});
