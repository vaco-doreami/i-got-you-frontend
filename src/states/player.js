import { atom } from "recoil";

export const playerState = atom({
  key: "playerState",
  default: {
    id: "",
    role: "",
    nickname: "",
    characterType: "",
    characterPath: "",
  },
});

export const roleCountState = atom({
  key: "roleCountState",
  default: {
    policeCount: 0,
    robberCount: 0,
  },
});
