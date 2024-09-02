class RTCDataChannel extends EventTarget {
  label = "";

  constructor(name) {
    super();
    this.label = name;
  }
}

window.RTCDataChannel = RTCDataChannel;
