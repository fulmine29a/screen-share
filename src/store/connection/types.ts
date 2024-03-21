export type ConnectionState =
  | { status: "NOT_INITIALIZED" | "CREATED" | "CONNECTED" }
  | {
      status: "SEARCH_FOR_CANDIDATES";
      localDescription: RTCSessionDescriptionInit;
    }
  | { status: "FAILED"; failReason: string }
  | {
      status: "CANDIDATES_FOUND";
      candidates: RTCIceCandidateInit[];
      localDescription: RTCSessionDescriptionInit;
    };

export type OfferOrAnswer = {
  description: RTCSessionDescriptionInit;
  candidates: RTCIceCandidateInit[];
};

export type ConnectionStatus = ConnectionState["status"];
