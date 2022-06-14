import { atom } from "recoil";

export const playerState = atom({
  key: "playerState",
  default: {
    id: "",
    role: "police",
    isHost: false,
    nickname: "",
    characterType: "police1",
  },
});

export const winnerState = atom({
  key: "winnerState",
  default: null,
});

export const roleCountState = atom({
  key: "roleCountState",
  default: {
    policeCount: 0,
    robberCount: 0,
  },
});
