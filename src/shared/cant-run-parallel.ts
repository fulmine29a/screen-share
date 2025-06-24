export const cantRunParallel: CantRunParallel = (fn) => {
  let launched = false;

  return async (...params) => {
    if (launched) {
      throw new Error(`can't run parallel: ${"name" in fn && fn.name}`);
    }
    launched = true;
    try {
      return await fn(...params);
    } finally {
      launched = false;
    }
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CantRunParallel = <F extends (...args: any[]) => Promise<any>>(
  fn: F,
) => (...params: Parameters<F>) => Promise<ReturnType<F>>;
