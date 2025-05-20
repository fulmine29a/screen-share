import { getStringMessageFromUnknownError } from "./getStringMessageFromUnknownError";

describe("getStringMessageFromUnknownError", () => {
  const defaultMessage = "Default Error Message";

  test.each([
    [null, defaultMessage],
    [undefined, defaultMessage],
    [false, defaultMessage],
    [true, defaultMessage],
    [123, "123"],
    [new Error("error message"), "error message"],
    [{ message: "error message" }, "error message"],
    [{ message: 123 }, '{"message":123}'],
    [{ unknown: "object" }, '{"unknown":"object"}'],
    [
      new (class CustomError extends Error {
        constructor(message: string) {
          super(message);
        }
      })("custom error message"),
      "custom error message",
    ],
    ["error message", "error message"],
    [100000n, "100000"],
    [Symbol("error"), "Symbol(error)"],
  ])("should handle input %p and return %p", (input, expected) => {
    const result = getStringMessageFromUnknownError(input, defaultMessage);
    expect(result).toBe(expected);
  });
});
