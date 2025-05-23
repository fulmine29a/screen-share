import { streamsAddOutgoing } from "../addOutgoing";
import { createAppThunk } from "../../../shared/store/create-app-thunk";

export const streamsCaptureScreen = createAppThunk(
  "streamsCaptureScreen",
  async (_, { dispatch }): Promise<boolean> => {
    try {
      const displayMediaStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
      });

      dispatch(
        streamsAddOutgoing({ stream: displayMediaStream, label: "Screen" }),
      );

      return true;
    } catch (e) {
      if (e instanceof DOMException) {
        if (["AbortError", "NotAllowedError"].includes(e.name)) {
          return false;
        }
      }

      throw e;
    }
  },
);
