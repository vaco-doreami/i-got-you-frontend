import io from "socket.io-client";

export const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export const socketApi = {
  sendHostInfo: player => {
    socket.emit("create-room", player);
  },
  enterRoomList: () => {
    socket.emit("enter-room-list");
  },
  joinRoom: (roomId, player) => {
    socket.emit("join-room", roomId, player);
  },
  enterGame: roomId => {
    socket.emit("game-enter", roomId);
  },
  pressArrowKeys: (roomId, playerId, currentDirection, coordinateX, coordinateY) => {
    socket.emit("player-move", { roomId, playerId, currentDirection, coordinateX, coordinateY });
  },
  offArrowKeys: (roomId, playerId, currentDirection, coordinateX, coordinateY) => {
    socket.emit("player-stop", { roomId, playerId, currentDirection, coordinateX, coordinateY });
  },
};
