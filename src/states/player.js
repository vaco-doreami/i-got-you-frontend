import { atom } from "recoil";

export const playerInfo = atom({
  key: "playerInfo",
  default: {
    nickname: "",
    role: "police",
    characterType: "police1",
    isHost: false,
  },
});
