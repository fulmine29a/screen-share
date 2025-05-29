import { AppDispatch } from "../../app/store";
import { getConnection } from "../../entities/connection/connection";
import { ControlChannelMessageType } from "../../entities/control-channel-message";
import { appSendControlChannelMessage } from "../app";

export const negotiationNeededHandler = (dispatch: AppDispatch) => async () => {
  const connection = getConnection();

  if (connection.connectionState == "new") {
    return;
  }

  const offer = await connection.createOffer(),
    msg: ControlChannelMessageType.NegotiationNeeded = {
      type: "negotiation needed",
      sdp: offer,
    };

  await connection.setLocalDescription(offer);

  dispatch(appSendControlChannelMessage(msg));
};
