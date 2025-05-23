import { runOnce } from "../run-once";

describe(runOnce.name, () => {
  const mock = jest.fn();
  mock.mockReturnValue(1);
  const run = runOnce(mock);

  test("run once", () => {
    run();
    run();
    expect(mock).toHaveBeenCalledTimes(1);
  });

  test("return value, first run", () => {
    expect(run()).toBe(1);
  });

  test("return value, multiple run", () => {
    run();
    expect(run()).toBe(1);
  });
});
