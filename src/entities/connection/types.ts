export type ConnectionRole = "CLIENT" | "SERVER";
type Role = { role: ConnectionRole };
export type ConnectionState =
  | { status: "NOT_INITIALIZED" | "CREATED" | "CONNECTED" }
  | ({
      status: "SEARCH_FOR_CANDIDATES";
    } & Role)
  | { status: "FAILED"; failReason: string }
  | ({
      status: "CANDIDATES_FOUND";
      localDescription: string;
    } & Role)
  | { status: "CONNECTED" }
  | { status: "DISCONNECTED" }
  | { status: "CLOSED" };

export type OfferOrAnswer = RTCSessionDescriptionInit;

export type ConnectionStatus = ConnectionState["status"];
