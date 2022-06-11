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
