import { streamsCaptureScreen } from "./index";
import { createAppStore } from "../../../app/store";
import { streamsAddOutgoing } from "../addOutgoing";
import { restoreMock, saveMock } from "../../../shared/test-utils/save-mock";
import { runOnce } from "../../../shared/test-utils/run-once";

jest.mock("../addOutgoing", () => {
  return {
    streamsAddOutgoing: jest.fn(),
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

    const returnValue = await store.dispatch(streamsCaptureScreen());

    return {
      capturedStream,
      store,
      mockGetDisplayMedia,
      streamsAddOutgoingMock: saveMock(streamsAddOutgoing),
      returnValue,
    };
  });

  test("call streamsAddOutgoing", async () => {
    const { capturedStream, streamsAddOutgoingMock } = await run();
    const streamsAddOutgoing = restoreMock(streamsAddOutgoingMock);

    expect(streamsAddOutgoing).toHaveBeenCalled();
    expect(streamsAddOutgoing).toHaveBeenCalledWith({
      label: "Screen",
      stream: capturedStream,
    });
  });

  // test("return true", async () => {
  //   const { returnValue } = await run();
  //
  //   expect(returnValue).toBe(true);
  // });
});
