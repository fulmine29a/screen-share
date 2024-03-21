export let connection: RTCPeerConnection | undefined = undefined;
export const setConnection = (c: RTCPeerConnection) => {
  connection = c;
};

export const deleteConnection = () => (connection = undefined);
