import { streamsAdd, streamsCaptureScreen, streamsRemove } from "./thunks";
import { createStore } from "../store";
import { streams } from "./streams";
import { streamSlice } from "./slice";
import { runOnce } from "../../utils/test-utils";

test("incoming stream", () => {
  const store = createStore();
  const stream = new MediaStream();

  store.dispatch(streamsAdd({ stream, direction: "in", label: "" }));

  expect(streams[stream.id]).toBe(stream);
  expect(
    streamSlice.selectors.incomingStreams(store.getState()),
  ).toContainEqual({ id: stream.id, direction: "in", label: "" });
});

test("outgoing stream", () => {
  const store = createStore();
  const stream = new MediaStream();

  store.dispatch(streamsAdd({ stream, direction: "out", label: "" }));

  expect(streams[stream.id]).toBe(stream);
  expect(
    streamSlice.selectors.outgoingStreams(store.getState()),
  ).toContainEqual({ id: stream.id, direction: "out", label: "" });
});

test("remove stream", () => {
  const store = createStore();
  const stream = new MediaStream();

  store.dispatch(streamsAdd({ stream, direction: "in", label: "" }));
  store.dispatch(streamsRemove(stream.id));

  expect(streams[stream.id]).toBeUndefined();
  expect(
    streamSlice.selectors.incomingStreams(store.getState()),
  ).not.toContainEqual({ id: stream.id, direction: "in", label: "" });
});

describe("streamsCaptureScreen", () => {
  const run = runOnce(async function () {
    const capturedStream = new MediaStream();
    const mockGetDisplayMedia = jest.fn().mockResolvedValue(capturedStream);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.navigator.mediaDevices = { getDisplayMedia: mockGetDisplayMedia };

    const store = createStore();
    await store.dispatch(streamsCaptureScreen());

    return { capturedStream, store, mockGetDisplayMedia };
  });

  test("calls getDisplayMedia", async () => {
    const { mockGetDisplayMedia } = await run();
    expect(mockGetDisplayMedia).toHaveBeenCalled();
  });

  test("stream includes in global streams", async () => {
    const { capturedStream } = await run();
    expect(streams[capturedStream.id]).toBe(capturedStream);
  });

  test("updates store with incoming screen stream", async () => {
    const { store, capturedStream } = await run();
    const state = store.getState();
    const incomingStreams = streamSlice.selectors.incomingStreams(state);
    expect(incomingStreams).toContainEqual({
      id: capturedStream.id,
      direction: "in",
      label: "Screen",
    });
  });

  test("no outgoing streams initially", async () => {
    const { store } = await run();
    const state = store.getState();
    const outgoingStreams = streamSlice.selectors.outgoingStreams(state);
    expect(outgoingStreams).toEqual([]);
  });
});
