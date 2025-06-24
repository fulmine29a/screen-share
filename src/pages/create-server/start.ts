import { AppStore } from "../../app/store";
import { connectionSlice } from "../../entities/connection/slice";
import { appRestart } from "../../features/app";
import { CANCELLED } from "../../shared/take-leading";
import { connectionCreateServer } from "../../features/connection/connection-create-server";
import { createAppThunk } from "../../shared/store/create-app-thunk";

export const createServerPageStart = createAppThunk(
  "createServerPageStart",
  async (store: AppStore, { dispatch, getState }) => {
    const restart = await dispatch(appRestart()).unwrap();
    if (restart != CANCELLED) {
      await dispatch(connectionCreateServer());
      const { promise, resolve } = Promise.withResolvers<undefined>(),
        waitForCandidatesFound = () => {
          const state = getState(),
            status = connectionSlice.selectors.status(state);

          if (status == "CANDIDATES_FOUND") {
            resolve(undefined);
          }
        },
        unsubscribe = store.subscribe(waitForCandidatesFound);
      await promise;

      unsubscribe();
    }
  },
);
