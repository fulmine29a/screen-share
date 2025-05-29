// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ControlChannelMessageType {
  export type NegotiationNeeded = {
    type: "negotiation needed";
    sdp: RTCSessionDescriptionInit;
  };

  export type NegotiationAnswer = {
    type: "negotiation answer";
    sdp: RTCSessionDescriptionInit;
  };
}

export type ControlChannelMessage =
  | ControlChannelMessageType.NegotiationNeeded
  | ControlChannelMessageType.NegotiationAnswer;
