import { atom } from "recoil";

export const playerState = atom({
  key: "playerState",
  default: {
    id: "",
    role: "police",
    nickname: "",
    characterType: "police1",
  },
});

export const roleCountState = atom({
  key: "roleCountState",
  default: {
    policeCount: 0,
    robberCount: 0,
  },
});
