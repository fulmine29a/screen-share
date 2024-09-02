/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: [
    "./__mock__/rtc-data-channel.js",
    "./__mock__/rtc-peer-connection.js",
    "./__mock__/rtc-ice-candidate.js",
  ],
  clearMocks: true,
};
