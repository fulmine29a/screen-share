import { clearStreams, streams } from "../../../entities/streams/streams";
import { streamSlice } from "../../../entities/streams/slice";
import { trackHandlerCreate } from "./index";

describe("trackHandlerCreate", () => {
  beforeEach(() => {
    clearStreams();
  });

  test("should add new stream and dispatch action", () => {
    const mockDispatch = jest.fn();
    const handler = trackHandlerCreate(mockDispatch);

    const stream = new MediaStream();
    const event: RTCTrackEvent = {
      streams: [stream],
      track: new MediaStreamTrack(),
      type: "track",
    } as unknown as RTCTrackEvent;

    handler(event);

    expect(streams[stream.id]).toBe(stream);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: streamSlice.actions.add.type,
        payload: { id: stream.id, direction: "in", label: "incoming stream" },
      }),
    );
  });

  test("should not add duplicated stream", () => {
    const mockDispatch = jest.fn();
    const handler = trackHandlerCreate(mockDispatch);

    const stream = new MediaStream();
    const event: RTCTrackEvent = {
      streams: [stream],
      track: new MediaStreamTrack(),
      type: "track",
    } as unknown as RTCTrackEvent;

    // First call
    handler(event);
    expect(streams[stream.id]).toBe(stream);
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Second call
    handler(event);
    expect(streams[stream.id]).toBe(stream);
    expect(mockDispatch).toHaveBeenCalledTimes(1); // No additional dispatch
  });

  test("should throw error if two streams", () => {
    const mockDispatch = jest.fn();
    const handler = trackHandlerCreate(mockDispatch);

    const stream1 = new MediaStream();
    const stream2 = new MediaStream();
    const event: RTCTrackEvent = {
      streams: [stream1, stream2],
      track: new MediaStreamTrack(),
      type: "track",
    } as unknown as RTCTrackEvent;

    expect(() => handler(event)).toThrow("The number of streams is not 1");
    expect(streams).toEqual({});
    expect(mockDispatch).not.toHaveBeenCalled();
  });
  test("should throw error if streams empty", () => {
    const mockDispatch = jest.fn();
    const handler = trackHandlerCreate(mockDispatch);

    const event: RTCTrackEvent = {
      streams: [],
      track: new MediaStreamTrack(),
      type: "track",
    } as unknown as RTCTrackEvent;

    expect(() => handler(event)).toThrow("The number of streams is not 1");
    expect(streams).toEqual({});
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
