import { createAppThunk } from "../../shared/store/create-app-thunk";
import { ControlChannelMessageType } from "../../entities/control-channel-message";
import { getConnection } from "../../entities/connection/connection";

export const connectionNegotiationAnswerMessage = createAppThunk(
  "connectionNegotiationAnswerMessage",
  async (msg: ControlChannelMessageType.NegotiationAnswer) => {
    const connection = getConnection();
    await connection.setRemoteDescription(msg.sdp);
  },
);
