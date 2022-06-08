import io from "socket.io-client";

export const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export const socketApi = {
  sendHostInfo: user => {
    socket.emit("create-room", user);
  },
  enterRoomList: () => {
    socket.emit("enter-room-list");
  },
  joinRoom: user => {
    socket.emit("join-room", user);
  },
};
