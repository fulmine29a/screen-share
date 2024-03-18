import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { errorSlice } from "../store/error/slice";
import { RootState } from "../store/store";
import { errorToAppError } from "../store/error/utils";

const connector = connect(
  (state: RootState) => ({
    errors: errorSlice.selectors.errors(state),
  }),
  (dispatch) => ({
    addError: (...arg: Parameters<typeof errorSlice.actions.add>) =>
      dispatch(errorSlice.actions.add(...arg)),
  }),
);

type PropsFromRedux = ConnectedProps<typeof connector>;

class ErrorBoundaryComponent extends React.PureComponent<
  React.PropsWithChildren<PropsFromRedux>
> {
  state = {
    hasError: false,
  };

  windowOnError = (event: ErrorEvent) => {
    if (process.env.NODE_ENV == "development") {
      /* React in development mode uses an alternate mode to wrap callbacks.
       instead of try catch, an onerror handler is used, this causes duplication of errors.
       */
      try {
        throw new Error("error for getting call stack");
      } catch (e) {
        if ((e as Error).stack?.includes("invokeGuardedCallbackDev")) {
          // fix message duplicate in console
          event.preventDefault();
          return;
        }
      }
    }

    this.props.addError(
      errorToAppError(event.error, "unknown error (window.onerror)"),
    );
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.addError(errorToAppError(error, "unknown error in render"));
  }

  componentDidMount() {
    window.addEventListener("error", this.windowOnError);
  }
  componentWillUnmount() {
    window.removeEventListener("error", this.windowOnError);
  }

  render() {
    if (this.state.hasError || this.props.errors.length) {
      return (
        <>
          <h1>Something went wrong.</h1>
          {this.props.errors.map((error, i) => (
            <React.Fragment key={i}>
              <h2>{error.message || `Error #${i + 1}`}</h2>
              <pre>{error.stack || "no call stack"}</pre>
            </React.Fragment>
          ))}
        </>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = connector(ErrorBoundaryComponent);
