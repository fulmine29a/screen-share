export const streams: Record<MediaStream["id"], MediaStream> = {};
export const clearStreams = () =>
  Object.keys(streams).forEach((key) => delete streams[key]);
