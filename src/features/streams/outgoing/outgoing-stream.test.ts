import { createAppThunk } from "../../../shared/store/create-app-thunk"; // Путь может отличаться в вашем проекте
import { getConnection } from "../../../entities/connection/connection";
import { runOnce } from "../../../shared/test-utils/run-once";
import { streamSlice } from "../../../entities/streams/slice";
import { restoreMock, saveMock } from "../../../shared/test-utils/save-mock";
import { createAppThunkMock } from "../../../shared/test-utils/create-app-thunk-mock";
import { clearStreams, streams } from "../../../entities/streams/streams";

jest.mock("../../../entities/connection/connection");
jest.mock("../../../shared/store/create-app-thunk");

(createAppThunk as unknown as jest.Mock).mockImplementation(createAppThunkMock);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { streamsSendOutgoing } = require(".");

describe("normal flow", () => {
  const run = runOnce(async () => {
    const dispatchMock = jest.fn();
    const mockStream = {
      id: "streamId",
      getTracks: jest
        .fn()
        .mockReturnValue([{ id: "track1" }, { id: "track2" }]), // Возвращает массив треков
    } as unknown as MediaStream;

    const addTrack = jest.fn();
    const params = { stream: mockStream, label: "testLabel" };

    (getConnection as jest.Mock).mockReturnValue({
      addTrack,
    });

    clearStreams();

    await streamsSendOutgoing(params)({ dispatchMock });

    return {
      mockStream,
      addTrack,
      dispatch: saveMock(dispatchMock),
      streams: { ...streams },
    };
  });

  test("add tracks", async () => {
    const { mockStream, addTrack } = await run();
    expect(addTrack).toHaveBeenCalledWith(
      mockStream.getTracks()[0],
      mockStream,
    );
    expect(addTrack).toHaveBeenCalledWith(
      mockStream.getTracks()[1],
      mockStream,
    );
  });

  test("add stream to streams", async () => {
    const { mockStream, streams } = await run();
    expect(streams[mockStream.id]).toBe(mockStream);
  });

  test("add stream to slice", async () => {
    const { mockStream, dispatch } = await run();
    const dispatchRestored = restoreMock(dispatch);

    expect(dispatchRestored).toHaveBeenCalledWith(
      streamSlice.actions.add({
        id: mockStream.id,
        direction: "out",
        label: "testLabel",
      }),
    );
  });
});
