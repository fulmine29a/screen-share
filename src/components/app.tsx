import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { appStart, appStop } from "../store/app-events";
import { connectionSlice } from "../store/connection/slice";
import {
  connectionCreateClient,
  connectionCreateServer,
  connectionServerSetAnswer,
} from "../store/connection/thunks";

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(connectionSlice.selectors.status);
  const failReason = useAppSelector(connectionSlice.selectors.failReason);
  const localDescription = useAppSelector(
    connectionSlice.selectors.localDescription,
  );

  const [remoteDescription, setRemoteDescription] =
    useState<RTCSessionDescriptionInit>({ sdp: "", type: "offer" });

  useEffect(() => {
    dispatch(appStart());

    return () => {
      dispatch(appStop());
    };
  }, []);

  return (
    <>
      <div>
        <button onClick={() => dispatch(connectionCreateServer())}>
          create server
        </button>
        <button
          onClick={() => dispatch(connectionCreateClient(remoteDescription))}
        >
          create client
        </button>
        <button
          onClick={() => dispatch(connectionServerSetAnswer(remoteDescription))}
        >
          set answer
        </button>
      </div>
      <div style={{ display: "flex" }}>
        <dl style={{ width: "50vw" }}>
          <dt>remote description</dt>
          <dd>
            <textarea
              rows={10}
              onChange={({ target: { value } }) =>
                setRemoteDescription(JSON.parse(value))
              }
              value={JSON.stringify(remoteDescription, null, 2)}
            ></textarea>
          </dd>
        </dl>
        <dl style={{ width: "50vw" }}>
          <dt>status</dt>
          <dd>{status}</dd>
          <dt>fail reason</dt>
          <dd>{failReason || "none"}</dd>
          <dt>localDescription</dt>
          <dd>
            <pre>
              {JSON.stringify(JSON.parse(localDescription || "{}"), null, 2)}
            </pre>
          </dd>
        </dl>
      </div>
    </>
  );
};
