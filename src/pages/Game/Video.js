import { useEffect, useRef } from "react";
import styled from "styled-components";
import { socket } from "../../utils/socket";

import Peer from "simple-peer";
import { useParams } from "react-router-dom";

export default function Video() {
  const { roomId } = useParams();

  const userVideo = useRef();
  const teamplayerVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;

      socket.emit("find-current-room", roomId);

      socket.on("return-current-room", payload => {
        const teamplayerId = payload.policeId.find(id => id !== socket.id);

        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
        });

        peer.on("signal", signal => {
          socket.emit("sending-signal-to-connect-webRTC", { userToSignal: teamplayerId, callerID: socket.id, signal });
        });

        peer.on("stream", stream => {
          teamplayerVideo.current.srcObject = stream;
        });

        socket.on("receiving-returned-signal-to-connect-webRTC", payload => {
          peer.signal(payload.signal);
        });
      });

      socket.on("new-video-chat-participant", payload => {
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
        });

        peer.on("signal", signal => {
          socket.emit("returning-signal-to-connect-webRTC", { signal, callerID: payload.callerID });
        });

        peer.on("stram", stream => {
          teamplayerVideo.current.srcObject = stream;
        });

        peer.signal(payload.signal);
      });
    });

    // return () => {
    //   socket.removeAllListeners("return-current-room");
    //   socket.removeAllListeners("new-video-chat-participant");
    //   socket.removeAllListeners("receiving-returned-signal-to-connect-webRTC");
    // };
  }, []);

  return (
    <VideoWrap>
      <div>
        <video playsInline autoPlay ref={userVideo} />
      </div>
      <div>
        <video playsInline autoPlay ref={teamplayerVideo} />
      </div>
    </VideoWrap>
  );
}

const VideoWrap = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 20px;

  div {
    width: 350px;
  }

  div:first-child {
    margin-right: 20px;
  }
`;
