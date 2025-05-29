import { checkErrors } from "../../../shared/test-utils/check-errors";
import { setConnection } from "../../../entities/connection/connection";
import { createAppStore } from "../../../app/store";
import { connectionSlice } from "../../../entities/connection/slice";
import { ConnectionStatus } from "../../../entities/connection/types";
import { FAKE_ANSWER, FAKE_OFFER } from "../test-data";
import { restoreMock, saveMock } from "../../../shared/test-utils/save-mock";
import { runOnce } from "../../../shared/test-utils/run-once";
import { getControlChannel } from "../../../entities/control-channel/control-channel";
import { connectionCreateServer } from "../connection-create-server";
import { connectionCreateClient } from "../connection-create-client";

describe("connectionCreateServer", () => {
  const testDataChannel = new RTCDataChannel();

  const run = runOnce(async function () {
    const connection = new RTCPeerConnection();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    connection.createOffer = jest.fn(async () => FAKE_OFFER);
    connection.setLocalDescription = jest.fn(async () => undefined);
    connection.createDataChannel = jest.fn(() => testDataChannel);
    setConnection(connection);
    const store = createAppStore();
    store.dispatch(connectionSlice.actions.setCreated());
    await store.dispatch(connectionCreateServer());
    const controlChannelAfter = getControlChannel();

    return {
      createOffer: saveMock(connection.createOffer),
      setLocalDescription: saveMock(connection.setLocalDescription),
      controlChannelAfter,
      store,
    };
  });

  test("no error", async () => {
    const { store } = await run();
    checkErrors(store, 0);
    expect(connectionSlice.selectors.failReason(store.getState())).toBeFalsy();
  });

  test("status in store", async () => {
    const { store } = await run();
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("SEARCH_FOR_CANDIDATES");
  });

  test("createOffer called", async () => {
    const fn = restoreMock((await run()).createOffer);
    expect(fn).toHaveBeenCalled();
  });

  test("send control channel to entity", async () => {
    const controlChannelAfter = (await run()).controlChannelAfter;

    expect(controlChannelAfter).toStrictEqual(testDataChannel);
  });

  test("local description", async () => {
    const fn = restoreMock((await run()).setLocalDescription);
    expect(fn).toHaveBeenCalledWith(FAKE_OFFER);
  });
});

describe("connectionCreateClient", () => {
  const run = runOnce(async function () {
    const connection = new RTCPeerConnection();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    connection.createAnswer = jest.fn(async () => FAKE_ANSWER);
    connection.setLocalDescription = jest.fn(async () => undefined);
    connection.setRemoteDescription = jest.fn(async () => undefined);
    setConnection(connection);
    const store = createAppStore();
    store.dispatch(connectionSlice.actions.setCreated());
    await store.dispatch(connectionCreateClient(FAKE_OFFER));

    return {
      createAnswer: saveMock(connection.createAnswer),
      setLocalDescription: saveMock(connection.setLocalDescription),
      setRemoteDescription: saveMock(connection.setRemoteDescription),
      store,
    };
  });

  test("no error", async () => {
    const { store } = await run();
    checkErrors(store, 0);
    expect(connectionSlice.selectors.failReason(store.getState())).toBeFalsy();
  });

  test("status in store", async () => {
    const { store } = await run();
    expect(
      connectionSlice.selectors.status(store.getState()),
    ).toBe<ConnectionStatus>("SEARCH_FOR_CANDIDATES");
  });

  test("create answer", async () => {
    const fn = restoreMock((await run()).createAnswer);
    expect(fn).toHaveBeenCalled();
  });

  test("remote description", async () => {
    const fn = restoreMock((await run()).setRemoteDescription);
    expect(fn).toHaveBeenCalledWith(FAKE_OFFER);
  });

  test("local description", async () => {
    const fn = restoreMock((await run()).setLocalDescription);
    expect(fn).toHaveBeenCalledWith(FAKE_ANSWER);
  });
});
