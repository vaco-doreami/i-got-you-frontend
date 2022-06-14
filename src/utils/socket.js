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
  leaveRoom: (roomId, role, id, isHost) => {
    socket.emit("leave-room", { roomId, role, id, isHost });
  },
  pressRunButton: roomId => {
    socket.emit("press-run-button", roomId);
  },
  standbyRoom: roomId => {
    socket.emit("standby-room", roomId);
  },
  findCurrentJoiningRoom: roomId => {
    socket.emit("find-current-joining-room", roomId);
  },
  returningSignalToConnectWebRTC: payload => {
    socket.emit("returning-signal-to-connect-webRTC", { signal: payload.signal, callerID: payload.callerID });
  },
  sendingSignalToConnectWebRTC: payload => {
    socket.emit("sending-signal-to-connect-webRTC", { userToSignal: payload.userToSignal, callerID: payload.callerID, signal: payload.signal });
  },
  leaveGame: (roomId, playerId, playerRole) => {
    socket.emit("leave-game", { roomId, playerId, playerRole });
  },
  openVideo: roomId => {
    socket.emit("close-video", roomId);
  },
  closeVideo: roomId => {
    socket.emit("open-video", roomId);
  },
};
