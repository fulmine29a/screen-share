// AI generated
class MediaStreamTrackMock extends EventTarget {
  constructor(kind) {
    super();
    this.kind = kind || "video"; // По умолчанию video
    this.enabled = true;
    this._muted = false;
    this._readyState = "live"; // Начальное состояние live
    this.onmute = null;
    this.onunmute = null;
  }

  get id() {
    return `track-${Math.random().toString(36).slice(2, 11)}`;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(value) {
    if (this._enabled !== value) {
      this._enabled = value;
      this._muted = !value;
      if (value) {
        this.dispatchEvent(new Event("unmute"));
      } else {
        this.dispatchEvent(new Event("mute"));
      }
    }
  }

  get muted() {
    return this._muted;
  }

  stop() {
    this.enabled = false;
    this._readyState = "ended";
  }

  get readyState() {
    return this._readyState;
  }
}

// Добавляем MediaStreamTrackMock в window
window.MediaStreamTrack = MediaStreamTrackMock;
