export function checkOffer(offer: string) {
  let canSubmitClient = true;
  let wrongOfferType = false;

  try {
    const parsedOffer = JSON.parse(atob(offer)) as RTCSessionDescriptionInit;
    if (
      typeof parsedOffer.sdp == "string" &&
      typeof parsedOffer.type == "string"
    ) {
      canSubmitClient = !(wrongOfferType = parsedOffer.type != "offer");
    }
  } catch {
    canSubmitClient = false;
  }

  return { canSubmitClient, wrongOfferType };
}
