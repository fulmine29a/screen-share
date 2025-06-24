import { CANCELLED, takeLeading } from "./take-leading";

test("single call", async () => {
  await expect(takeLeading(async (v) => v + 1)(2)).resolves.toBe(3);
});

test("multiple calls", async () => {
  const fn = takeLeading(async (promise: Promise<unknown>) => await promise),
    { promise: call1Wait, resolve: resolve1 } = Promise.withResolvers(),
    call2Wait = Promise.resolve();

  const call1 = fn(call1Wait),
    call2 = fn(call2Wait);
  await expect(call1).resolves.toBe(CANCELLED);
  resolve1(undefined);
  await expect(call2).resolves.toBeUndefined();
});

test("exception", async () => {
  const run = takeLeading(async () => {
    throw "2";
  })();
  await expect(run).rejects.toBe("2");
});
