import { createAppThunk, createStore } from "../store";
import { errorSlice } from "./slice";

describe("error handling", () => {
  test("in thunk", () => {
    const EXPECTED_ERROR_MESSAGE = "test error in thunk";

    const testEffect = createAppThunk("test-effect", () => {
      throw new Error(EXPECTED_ERROR_MESSAGE);
    });

    const store = createStore();

    store.dispatch(testEffect());

    expect(errorSlice.selectors.errors(store.getState())).toStrictEqual([
      {
        message: EXPECTED_ERROR_MESSAGE,
        name: "Error",
        stack: expect.stringContaining(""),
      },
    ]);
  });

  test("in reducer (do middlewares miss the error?)", () => {
    const store = createStore();

    expect(() => store.dispatch(errorSlice.actions.raiseError())).toThrow(
      "error in reducer",
    );
  });
});
