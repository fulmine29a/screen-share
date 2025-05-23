let controlChannel: RTCDataChannel | undefined;

export const getControlChannel = (): RTCDataChannel => {
  if (!controlChannel) {
    throw new Error("Control channel used before initializing");
  }
  return controlChannel;
};

export const setControlChannel = (channel: RTCDataChannel) => {
  controlChannel = channel;
};
