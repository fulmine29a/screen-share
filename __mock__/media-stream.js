// AI generated
class MediaStream extends EventTarget {
  static count = 0;

  constructor() {
    super();
    this.id = `media-stream-${MediaStream.count++}`;
    this._tracks = []; // Массив для хранения треков
  }

  get active() {
    return this._tracks.some(({ readyState }) => readyState != "ended");
  }

  addTrack(track) {
    if (track instanceof MediaStreamTrack) {
      this._tracks.push(track);
      this.dispatchEvent(new Event("addtrack", { detail: track }));
    } else {
      throw new Error("Track must be an instance of MediaStreamTrack");
    }
  }

  removeTrack(track) {
    const index = this.tracks.indexOf(track);
    if (index !== -1) {
      this._tracks.splice(index, 1);
      this.dispatchEvent(new Event("removetrack", { detail: track }));
    } else {
      throw new Error("Track not found in the stream");
    }
  }

  getAudioTracks() {
    return this._tracks.filter((track) => track.kind === "audio");
  }

  getVideoTracks() {
    return this._tracks.filter((track) => track.kind === "video");
  }
}

// Добавляем классы в window
window.MediaStream = MediaStream;
