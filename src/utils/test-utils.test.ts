import { checkErrors, restoreMock, runOnce, saveMock } from "./test-utils";
import { createStore } from "../store/store";
import { errorSlice } from "../store/error/slice";

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

describe("save/restore mock", () => {
  const mock = jest.fn();

  mock(1);

  const savedMock = saveMock(mock);

  test("", () => {
    const restoredMock = restoreMock(savedMock);
    expect(restoredMock).toHaveBeenCalledTimes(1);
    expect(restoredMock).toHaveBeenCalledWith(1);
  });
});

describe(checkErrors.name, () => {
  test("no errors", () => {
    const store = createStore();

    expect(() => checkErrors(store, 0)).not.toThrow();
    expect(() => checkErrors(store, 1)).toThrow();
  });

  test("has error", () => {
    const store = createStore();
    store.dispatch(errorSlice.actions.add({ message: "test error" }));

    expect(() => checkErrors(store, 0)).toThrow();
    expect(() => checkErrors(store, 1)).not.toThrow();
  });
});
