import { createAppThunk, createStore } from "../../shared/store/store";
import { errorSlice } from "./slice";

describe("error handling", () => {
  test("throw Error in thunk", () => {
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

  test("common error in thunk", () => {
    const testEffect = createAppThunk("test-effect", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      undefined();
    });

    const store = createStore();

    store.dispatch(testEffect());

    expect(errorSlice.selectors.errors(store.getState())).toHaveLength(1);
  });

  test("skip reject in thunk", () => {
    const testEffect = createAppThunk(
      "test-effect",
      (_, { rejectWithValue }) => {
        rejectWithValue(1);
      },
    );

    const store = createStore();

    store.dispatch(testEffect());

    expect(errorSlice.selectors.errors(store.getState())).toStrictEqual([]);
  });

  test("in reducer (do middlewares miss the error?)", () => {
    const store = createStore();

    expect(() => store.dispatch(errorSlice.actions.raiseError())).toThrow(
      "error in reducer",
    );
  });
});
