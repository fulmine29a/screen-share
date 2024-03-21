import React, { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { appStart, appStop } from "../store/app-events";

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(appStart());

    return () => {
      dispatch(appStop());
    };
  }, []);

  return "App";
};
