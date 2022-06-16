import io from "socket.io-client";
import { ASSIGN_ROOM_CREATOR_AS_HOST, ENTER_GAME, ENTER_ROOM_LIST, JOIN_ROOM, LEAVE_ROOM, LEAVE_GAME, HANDLE_RUN_BUTTON, STANDBY } from "../constants/socket";
import { ARREST_ROBBER, POLICE_OPACITY_CHANGED, FIND_CURRENT_JOINING_ROOM, OPEN_VIDEO, CLOSE_VIDEO, PLAYER_MOVE, PLAYER_STOP, RETURNING_SIGNAL_TO_CONNECT_WEBRTC, SENDING_SIGNAL_TO_CONNECT_WEBRTC } from "../constants/phaser";

export const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export const socketApi = {
  assignRoomCreatorAsHost: player => {
    socket.emit(ASSIGN_ROOM_CREATOR_AS_HOST, player);
  },
  enterRoomList: () => {
    socket.emit(ENTER_ROOM_LIST);
  },
  joinRoom: (roomId, player) => {
    socket.emit(JOIN_ROOM, roomId, player);
  },
  enterGame: roomId => {
    socket.emit(ENTER_GAME, roomId);
  },
  standby: roomId => {
    socket.emit(STANDBY, roomId);
  },
  pressArrowKeys: (roomId, playerId, currentDirection, coordinateX, coordinateY) => {
    socket.emit(PLAYER_MOVE, { roomId, playerId, currentDirection, coordinateX, coordinateY });
  },
  offArrowKeys: (roomId, playerId, currentDirection, coordinateX, coordinateY) => {
    socket.emit(PLAYER_STOP, { roomId, playerId, currentDirection, coordinateX, coordinateY });
  },
  policeOpacityChanged: (roomId, playerId) => {
    socket.emit(POLICE_OPACITY_CHANGED, { roomId, playerId });
  },
  arrestRobber: (roomId, playerId) => {
    socket.emit(ARREST_ROBBER, { roomId, playerId });
  },
  leaveRoom: (roomId, role, id, isHost) => {
    socket.emit(LEAVE_ROOM, { roomId, role, id, isHost });
  },
  handleRunButton: roomId => {
    socket.emit(HANDLE_RUN_BUTTON, roomId);
  },
  leaveGame: (roomId, playerId, playerRole) => {
    socket.emit(LEAVE_GAME, { roomId, playerId, playerRole });
  },
  findCurrentJoiningRoom: roomId => {
    socket.emit(FIND_CURRENT_JOINING_ROOM, roomId);
  },
  returningSignalToConnectWebRTC: payload => {
    const { signal, callerID } = payload;

    socket.emit(RETURNING_SIGNAL_TO_CONNECT_WEBRTC, { signal, callerID });
  },
  sendingSignalToConnectWebRTC: payload => {
    const { userToSignal, signal, callerID } = payload;

    socket.emit(SENDING_SIGNAL_TO_CONNECT_WEBRTC, { userToSignal, signal, callerID });
  },
  openVideo: roomId => {
    socket.emit(OPEN_VIDEO, roomId);
  },
  closeVideo: roomId => {
    socket.emit(CLOSE_VIDEO, roomId);
  },
};
