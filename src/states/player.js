import { atom } from "recoil";

export const playerState = atom({
  key: "playerState",
  default: {
    nickname: "",
    role: "police",
    characterType: "police1",
    isHost: false,
  },
});
