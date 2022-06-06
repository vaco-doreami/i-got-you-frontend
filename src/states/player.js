import { atom } from "recoil";

export const info = atom({
  key: "info",
  default: {
    nickname: "",
    role: "police",
    characterType: "police1",
  },
});
