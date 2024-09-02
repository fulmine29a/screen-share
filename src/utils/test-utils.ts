import { AppStore } from "../store/store";
import { errorSlice } from "../store/error/slice";

type SavedMock = jest.Mock["mock"];

export function saveMock(mock: CallableFunction): SavedMock {
  // https://jestjs.io/ru/docs/mock-function-api#mockfnmockclear
  return (mock as jest.Mock).mock;
}

export function restoreMock(mock: SavedMock): jest.Mock {
  const fn = jest.fn();
  fn.mock = mock;
  return fn;
}

export function runOnce<R>(fn: () => R) {
  let cached: ReturnType<typeof fn> | undefined = undefined;

  return function () {
    if (cached) {
      return cached;
    }
    return (cached = fn());
  };
}

export const checkErrors = (store: AppStore, expectedErrors: number) => {
  const errors = errorSlice.selectors.errors(store.getState());
  expect(errors).toHaveLength(expectedErrors);
};
