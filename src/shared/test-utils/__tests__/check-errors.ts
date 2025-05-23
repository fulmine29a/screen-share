import { checkErrors } from "../check-errors";
import { createAppStore } from "../../../app/store";
import { errorSlice } from "../../../entities/error/slice";

describe(checkErrors.name, () => {
  test("no errors", () => {
    const store = createAppStore();

    expect(() => checkErrors(store, 0)).not.toThrow();
    expect(() => checkErrors(store, 1)).toThrow();
  });

  test("has error", () => {
    const store = createAppStore();
    store.dispatch(errorSlice.actions.add({ message: "test error" }));

    expect(() => checkErrors(store, 0)).toThrow();
    expect(() => checkErrors(store, 1)).not.toThrow();
  });
});
