/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: [
    "./__mock__/rtc-data-channel.js",
    "./__mock__/rtc-peer-connection.js",
    "./__mock__/rtc-ice-candidate.js",
    "./__mock__/media-stream-track.js",
    "./__mock__/media-stream.js",
    "./__mock__/text-encoder.js",
  ],
  clearMocks: true,
};
