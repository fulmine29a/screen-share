import { OfferOrAnswer } from "../../entities/connection/types";

export const FAKE_OFFER: OfferOrAnswer = {
  type: "offer",
  sdp: "sdp-for-test-offer",
};
export const FAKE_ANSWER: OfferOrAnswer = {
  type: "answer",
  sdp: "sdp-for-test-answer",
};

export const CANDIDATES: RTCIceCandidateInit[] = [
  { candidate: "candidate 1" },
  { candidate: "candidate 2" },
  { candidate: "candidate 3" },
];
