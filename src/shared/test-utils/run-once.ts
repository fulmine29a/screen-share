export function runOnce<R>(fn: () => R) {
  let cached: ReturnType<typeof fn> | undefined = undefined;

  return function () {
    if (cached) {
      return cached;
    }
    return (cached = fn());
  };
}
