import React from "react";
import { useAppSelector } from "../shared/store/hooks";
import { errorSlice } from "../entities/error/slice";

export const ErrorPage: React.FC = () => {
  const errors = useAppSelector(errorSlice.selectors.errors);

  return (
    <>
      <h1>Something went wrong.</h1>
      {errors.map((error, i) => (
        <React.Fragment key={i}>
          <h2>{error.message || `Error #${i + 1}`}</h2>
          <pre>{error.stack || "no call stack"}</pre>
        </React.Fragment>
      ))}
    </>
  );
};
