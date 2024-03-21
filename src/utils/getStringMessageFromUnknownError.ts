export function getStringMessageFromUnknownError(
  e: unknown,
  defaultMessage: string,
) {
  let message: string;

  switch (true) {
    case !e || e === true:
      message = defaultMessage;
      break;
    case typeof e == "symbol":
      message = e.toString();
      break;
    case typeof e == "object":
      message =
        "message" in e && typeof e.message == "string"
          ? e.message
          : JSON.stringify(e);
      break;
    default:
      message = `${e}`;
  }

  return message;
}
