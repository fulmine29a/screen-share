import { createAppThunk } from "../../../shared/store/create-app-thunk";
import { streamsCaptureScreen } from "./index";
import { createAppStore } from "../../../app/store";
import { streamsSendOutgoing } from "../outgoing";
import { restoreMock, saveMock } from "../../../shared/test-utils/save-mock";
import { runOnce } from "../../../shared/test-utils/run-once";
import { checkErrors } from "../../../shared/test-utils/check-errors";

jest.mock("../outgoing", () => {
  return {
    streamsSendOutgoing: jest.fn(
      createAppThunk("streamsSendOutgoing", () => {}),
    ),
  };
});

describe("streamsCaptureScreen normal flow", () => {
  const run = runOnce(async function () {
    const capturedStream = new MediaStream();
    const mockGetDisplayMedia = jest.fn().mockResolvedValue(capturedStream);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.navigator.mediaDevices = { getDisplayMedia: mockGetDisplayMedia };

    const store = createAppStore();

    const returnValue = await store.dispatch(streamsCaptureScreen()).unwrap();

    return {
      capturedStream,
      store,
      mockGetDisplayMedia,
      streamsSendOutgoingMock: saveMock(streamsSendOutgoing),
      returnValue,
    };
  });

  test("call streamsSendOutgoing", async () => {
    const { capturedStream, streamsSendOutgoingMock } = await run();
    const streamsAddOutgoing = restoreMock(streamsSendOutgoingMock);

    expect(streamsAddOutgoing).toHaveBeenCalled();
    expect(streamsAddOutgoing).toHaveBeenCalledWith({
      label: "Screen",
      stream: capturedStream,
    });
  });

  test("return true", async () => {
    const { returnValue } = await run();

    expect(returnValue).toBe(true);
  });
});

describe.each(["NotAllowedError", "AbortError"])(
  "streamsCaptureScreen raise %s",
  () => {
    const run = runOnce(async function () {
      const mockGetDisplayMedia = jest
        .fn()
        .mockRejectedValue(new DOMException("test", "AbortError"));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      global.navigator.mediaDevices = { getDisplayMedia: mockGetDisplayMedia };

      const store = createAppStore();

      const returnValue = await store.dispatch(streamsCaptureScreen()).unwrap();

      return {
        store,
        returnValue,
      };
    });

    test("return false", async () => {
      const { returnValue } = await run();
      expect(returnValue).toBe(false);
    });

    test("no errors", async () => {
      const { store } = await run();
      checkErrors(store, 0);
    });
  },
);

describe("streamsCaptureScreen other error", () => {
  const run = runOnce(async function () {
    const mockGetDisplayMedia = jest
      .fn()
      .mockRejectedValue(new Error("test error"));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.navigator.mediaDevices = { getDisplayMedia: mockGetDisplayMedia };

    const store = createAppStore();
    await store.dispatch(streamsCaptureScreen()).unwrap();
  });

  test("throw error", async () => {
    await expect(run()).rejects.toStrictEqual({
      message: "test error",
      name: "Error",
      stack: expect.anything(),
    });
  });
});
