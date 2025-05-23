import { AppStore } from "../../app/store";
import { errorSlice } from "../../entities/error/slice";

export const checkErrors = (store: AppStore, expectedErrors: number) => {
  const errors = errorSlice.selectors.errors(store.getState());
  expect(errors).toHaveLength(expectedErrors);
};
