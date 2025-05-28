import { streamsSendOutgoing } from "../outgoing";
import { createAppThunk } from "../../../shared/store/create-app-thunk";

export const streamsCaptureScreen = createAppThunk(
  "streamsCaptureScreen",
  async (_, { dispatch }): Promise<boolean> => {
    try {
      const displayMediaStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
      });

      await dispatch(
        streamsSendOutgoing({ stream: displayMediaStream, label: "Screen" }),
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
