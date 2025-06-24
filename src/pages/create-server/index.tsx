import React, { useEffect } from "react";
import { useAppSelector } from "../../shared/store/hooks";
import { connectionSlice } from "../../entities/connection/slice";
import { useStore } from "react-redux";
import { AppStore } from "../../app/store";
import { createServerPageStart } from "./start";
import { Page } from "./page";
import { FullScreenLoader } from "../../widgets/streams/full-screen-loader";

const Wrapper: React.FC = () => {
  const store = useStore() as AppStore,
    connectionStatus = useAppSelector(connectionSlice.selectors.status),
    role = useAppSelector(connectionSlice.selectors.role);

  useEffect(() => {
    if (connectionStatus != "CANDIDATES_FOUND" || role != "SERVER") {
      store.dispatch(createServerPageStart(store));
    }
  }, []);

  if (connectionStatus == "CANDIDATES_FOUND") {
    return <Page />;
  }

  return <FullScreenLoader />;
};

export const CreateServerPage = Wrapper;
