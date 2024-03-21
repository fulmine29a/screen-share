class RTCPeerConnection extends EventTarget {
  constructor() {
    super();
    this.localDescription = null;
    this.remoteDescription = null;
    this.iceConnectionState = "new";
    this.iceCandidates = [];
  }

  _checkToStartConnection() {
    if (
      this.localDescription &&
      this.remoteDescription &&
      (this.remoteDescription.type == "offer" || this.iceCandidates.length)
    ) {
      this.connectionState = "connecting";
      this.iceConnectionState = "checking";
    }
  }

  createOffer() {
    return Promise.resolve({ type: "offer", sdp: "fake-sdp-offer" });
  }

  createAnswer() {
    return Promise.resolve({ type: "answer", sdp: "fake-sdp-answer" });
  }

  setLocalDescription(description) {
    this.localDescription = description;
    if (description.type == "answer") {
      this._checkToStartConnection();
    }
    return Promise.resolve(true);
  }

  addIceCandidate = jest.fn(async (candidate) => {
    if (candidate && candidate.candidate) {
      if (candidate instanceof RTCIceCandidate) {
        this.iceCandidates.push(candidate);
      } else {
        throw new Error("candidate must be instance of RTCIceCandidate");
      }
    }
  });

  setRemoteDescription(description) {
    this.remoteDescription = description;
    if (description.type == "answer") {
      this._checkToStartConnection();
    }
    return Promise.resolve(true);
  }

  close() {
    this.iceConnectionState = "closed";
    this.connectionState = "closed";
  }
}

class RTCPeerConnectionIceEvent extends Event {
  constructor(type, options) {
    super(type, options);
    this.candidate = options.candidate;
  }
}

window.RTCPeerConnection = RTCPeerConnection;
window.RTCPeerConnectionIceEvent = RTCPeerConnectionIceEvent;
