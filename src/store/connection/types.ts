export type ConnectionState =
  | { status: "NOT_INITIALIZED" | "CREATED" | "CONNECTED" }
  | {
      status: "SEARCH_FOR_CANDIDATES";
    }
  | { status: "FAILED"; failReason: string }
  | {
      status: "CANDIDATES_FOUND";
      localDescription: RTCSessionDescriptionInit;
    };

export type OfferOrAnswer = RTCSessionDescriptionInit;

export type ConnectionStatus = ConnectionState["status"];
