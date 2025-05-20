export type StreamDirection = "in" | "out";

export type StreamRecord = {
  id: MediaStream["id"];
  direction: StreamDirection;
  label: string;
};

export type StreamState = {
  streams: StreamRecord[];
};
