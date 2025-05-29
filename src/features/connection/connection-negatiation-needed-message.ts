import { createAppThunk } from "../../shared/store/create-app-thunk";
import { ControlChannelMessage } from "../../entities/control-channel-message";
import { getConnection } from "../../entities/connection/connection";
import { appSendControlChannelMessage } from "../app";

export const connectionNegotiationNeededMessage = createAppThunk(
  "connectionNegotiationNeededMessage",
  async (msg: ControlChannelMessage, { dispatch }) => {
    const connection = getConnection();

    await connection.setRemoteDescription(msg.sdp);
    const answer = await connection.createAnswer();
    await connection.setLocalDescription(answer);

    await dispatch(
      appSendControlChannelMessage({
        type: "negotiation answer",
        sdp: answer,
      }),
    );
  },
);
