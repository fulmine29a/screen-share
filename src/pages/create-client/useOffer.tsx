import React, { useEffect, useRef, useState } from "react";
import { checkOffer } from "./checkOffer";

export function useOffer() {
  const [offer, setOffer] = useState("");
  const [debouncedCanSubmitClient, setDebouncedCanSubmitClient] =
    useState(true);
  const [debouncedWrongOfferType, setDebouncedWrongOfferType] = useState(false);

  const changeOfferTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const offerRef = useRef<string>(offer);

  const onChangeOffer: React.ChangeEventHandler<HTMLTextAreaElement> = ({
    currentTarget,
  }) => {
    setOffer(currentTarget.value);
    offerRef.current = currentTarget.value;

    setDebouncedCanSubmitClient(true);
    setDebouncedWrongOfferType(false);
    if (changeOfferTimeout.current) {
      clearTimeout(changeOfferTimeout.current);
    }

    changeOfferTimeout.current = setTimeout(() => {
      const { canSubmitClient, wrongOfferType } = checkOffer(offerRef.current);

      setDebouncedCanSubmitClient(canSubmitClient);
      setDebouncedWrongOfferType(wrongOfferType);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (changeOfferTimeout.current) {
        clearTimeout(changeOfferTimeout.current);
      }
    };
  }, []);

  return {
    offer,
    debouncedCanSubmitClient,
    debouncedWrongOfferType,
    onChangeOffer,
  };
}
