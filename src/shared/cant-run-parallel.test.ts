import { cantRunParallel } from "./cant-run-parallel";

test("run once", async () => {
  const fn = async (...params: unknown[]) => params,
    wrappedFn = cantRunParallel(fn);

  expect(await wrappedFn(1, 3)).toStrictEqual([1, 3]);
});

test("run parallel", async () => {
  let endFirst: (_: unknown) => void, secondValue;
  const fn = async (wait: boolean, secondArg: number) => {
      secondValue = secondArg;
      if (wait) {
        return new Promise((resolve) => {
          endFirst = resolve;
        });
      }

      return secondArg;
    },
    wrappedFn = cantRunParallel(fn);

  const firstRun = wrappedFn(true, 1);
  expect(secondValue).toBe(1);
  await expect(wrappedFn(false, 0)).rejects.toBeTruthy();
  endFirst!(2);
  await expect(firstRun).resolves.toBe(2);

  await expect(wrappedFn(false, 4)).resolves.toBe(4);
  expect(secondValue).toBe(4);
});

test("run parallel", async () => {
  const fn = async (throwError: boolean) => {
      if (throwError) {
        throw new Error("throwError");
      }
    },
    wrappedFn = cantRunParallel(fn);

  const firstRun = wrappedFn(true);
  await expect(firstRun).rejects.toBeTruthy();

  await expect(wrappedFn(false)).resolves.toBeUndefined();
});
