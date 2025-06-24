let connection: RTCPeerConnection | undefined = undefined;

export const getConnection = () => {
  if (!connection) {
    throw new Error("connection used before initialize");
  }

  return connection;
};

export const hasConnection = () => !!connection;

export const setConnection = (c: RTCPeerConnection) => {
  if (hasConnection()) {
    throw new Error("connection already set");
  }
  connection = c;
};

export const deleteConnection = () => (connection = undefined);
