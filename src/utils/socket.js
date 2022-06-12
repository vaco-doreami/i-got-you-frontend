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
  policeOpacityChanged: (roomId, playerId) => {
    socket.emit("police-opacity-change", { roomId, playerId });
  },
  arrestRobber: (roomId, playerId) => {
    socket.emit("arrest-robber", { roomId, playerId });
  },
  findCurrentJoiningRoom: roomId => {
    socket.emit("find-current-joining-room", roomId);
  },
  sendingSignalToConnectWebRTC: (teamplayerId, socketId, signal) => {
    socket.emit("sending-signal-to-connect-webRTC", { userToSignal: teamplayerId, callerID: socketId, signal });
  },
  returningSignalToConnectWebRTC: (signal, callerID) => {
    socket.emit("returning-signal-to-connect-webRTC", { signal, callerID });
  },
};
