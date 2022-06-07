import io from "socket.io-client";

export const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export const socketApi = {
  sendHostInfo: user => {
    socket.emit("create-room", {
      nickname: user.nickname,
      role: user.role,
      characterType: user.characterType,
      coordinateX: user.coordinateX,
      coordinateY: user.coordinateY,
    });
  },
};
