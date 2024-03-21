class RTCIceCandidate {
  constructor({ candidate }) {
    this.candidate = candidate;
  }

  toJSON() {
    return {
      ...this,
    };
  }
}

window.RTCIceCandidate = RTCIceCandidate;
