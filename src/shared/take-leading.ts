// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAsyncFunc = (...args: any) => Promise<any>;

export const CANCELLED = "canceled by takeLeading";

export const takeLeading = <FN extends AnyAsyncFunc, R = ReturnType<FN>>(
  fn: FN,
) => {
  let prevCallResolve: (v: R | typeof CANCELLED) => void = () => {},
    activeCall: Promise<R>,
    free = true;

  return (...params: Parameters<FN>): Promise<R | typeof CANCELLED> => {
    if (free) {
      free = false;
      activeCall = fn(...params).finally(() => (free = true));
    } else {
      prevCallResolve(CANCELLED);
    }
    const {
      promise: currentCall,
      reject,
      resolve,
    } = Promise.withResolvers<R | typeof CANCELLED>();
    prevCallResolve = resolve;
    activeCall.then(resolve, reject);
    return currentCall;
  };
};
