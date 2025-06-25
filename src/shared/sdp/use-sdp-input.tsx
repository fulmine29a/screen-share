import React, { useEffect, useRef, useState } from "react";
import { checkSessionDescription } from "./check-session-description";

export function useSdpInput(type: RTCSdpType) {
  const [sdp, setSdp] = useState("");
  const [debouncedSdpOK, setDebouncedSdpOK] = useState(true);
  const [debouncedWrongSdpType, setDebouncedWrongSdpType] = useState(false);

  const changeOfferTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const offerRef = useRef<string>(sdp);

  const _setSdp = (newSdp: string) => {
    setSdp(newSdp.trim());
    offerRef.current = newSdp.trim();

    setDebouncedSdpOK(true);
    setDebouncedWrongSdpType(false);
    if (changeOfferTimeout.current) {
      clearTimeout(changeOfferTimeout.current);
    }

    changeOfferTimeout.current = setTimeout(() => {
      const { valid, wrongOfferType } = checkSessionDescription(
        offerRef.current,
        type,
      );

      setDebouncedSdpOK(valid);
      setDebouncedWrongSdpType(wrongOfferType);
    }, 1000);
  };

  const onChangeSdp: React.ChangeEventHandler<HTMLTextAreaElement> = ({
    currentTarget,
  }) => {
    _setSdp(currentTarget.value);
  };

  const pasteSdp = () => {
    navigator.clipboard.readText().then(_setSdp);
  };

  useEffect(
    () => () => {
      if (changeOfferTimeout.current) {
        clearTimeout(changeOfferTimeout.current);
      }
    },
    [],
  );

  const showSdpErrors = !debouncedSdpOK && !!sdp;

  return {
    sdp,
    debouncedSdpOK,
    debouncedWrongSdpType,
    onChangeSdp,
    showSdpErrors,
    pasteSdp,
  };
}
