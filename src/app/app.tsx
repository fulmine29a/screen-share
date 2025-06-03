import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../shared/store/hooks";
import { connectionSlice } from "../entities/connection/slice";
import { appStart, appStop } from "../features/app";
import { streamSlice } from "../entities/streams/slice";
import { streamsCaptureScreen } from "../features/streams/capture-screen";
import { connectionCreateServer } from "../features/connection/connection-create-server";
import { connectionServerSetAnswer } from "../features/connection/connection-server-set-answer";
import { connectionCreateClient } from "../features/connection/connection-create-client";
import { VideoStreamWidget } from "../widgets/streams/video";

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
  }, []);

  const outStreams = useAppSelector(streamSlice.selectors.outgoingStreams);
  const inStreams = useAppSelector(streamSlice.selectors.incomingStreams);
  const streams = [...outStreams, ...inStreams];

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
        <button onClick={() => dispatch(appStart())}>app start</button>
        <button onClick={() => dispatch(appStop())}>app stop</button>
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
      <div>
        <div>
          <button onClick={() => dispatch(streamsCaptureScreen())}>
            capture screen
          </button>
        </div>
        {streams.map((stream, i) => (
          <VideoStreamWidget key={i} id={stream.id} style={{ maxWidth: 300 }} />
        ))}
      </div>
    </>
  );
};
