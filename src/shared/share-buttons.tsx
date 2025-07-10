import React from "react";
import { Button } from "react-bootstrap";

type Props = {
  text: string;
};

export const ShareButtons: React.FC<Props> = ({ text }) => {
  return (
    <>
      <Button
        className="my-3 me-2"
        size="sm"
        disabled={!navigator.clipboard}
        onClick={() => navigator.clipboard.writeText(text)}
      >
        Копировать
      </Button>
      <Button
        size="sm"
        disabled={!navigator.share}
        onClick={() => {
          navigator.share({ text });
        }}
      >
        Share
      </Button>
    </>
  );
};
