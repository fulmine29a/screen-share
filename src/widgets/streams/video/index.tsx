import { StreamRecord } from "../../../entities/streams/types";
import { streams } from "../../../entities/streams/streams";
import React, { MouseEventHandler, ReactNode, useEffect, useRef } from "react";
import styles from "./video-stream-element-widget.module.css";
import { clsx } from "clsx";

interface VideoStreamWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  id: StreamRecord["id"];
}

export const VideoStreamWidget: React.FC<VideoStreamWidgetProps> = ({
  id,
  className,
  ...htmlProps
}) => {
  const stream = streams[id];
  const videoRef = useRef<HTMLVideoElement>(null);
  const onVideoElementClick: MouseEventHandler<HTMLVideoElement> = ({
    currentTarget,
  }) => currentTarget.requestFullscreen();

  let body: ReactNode;
  if (stream) {
    body = (
      <video
        ref={videoRef}
        onClick={onVideoElementClick}
        autoPlay
        controls={false}
      ></video>
    );
  } else {
    body = "stream not found";
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.controls = false;
    }
  }, [stream.id]);

  return (
    <div
      {...htmlProps}
      className={clsx(styles["video-stream-element-widget"], className)}
    >
      {body}
    </div>
  );
};
