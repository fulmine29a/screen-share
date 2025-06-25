export function checkSessionDescription(offer: string, type: RTCSdpType) {
  let valid = true;
  let wrongOfferType = false;

  try {
    const parsedOffer = JSON.parse(atob(offer)) as RTCSessionDescriptionInit;
    if (
      typeof parsedOffer.sdp == "string" &&
      typeof parsedOffer.type == "string"
    ) {
      valid = !(wrongOfferType = parsedOffer.type != type);
    }
  } catch {
    valid = false;
  }

  return { valid, wrongOfferType };
}
