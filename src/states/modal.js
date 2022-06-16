import { atom } from "recoil";

export const preloadState = atom({
  key: "preloadState",
  default: true,
});

export const timeState = atom({
  key: "timeState",
  default: false,
});

export const winnerState = atom({
  key: "winnerState",
  default: null,
});
