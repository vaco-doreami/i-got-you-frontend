import { atom } from "recoil";

export const modalStatus = atom({
  key: "modalIsOpen",
  default: true,
});
