import { useEffect, useRef } from "react";
import styled from "styled-components";
import { socket, socketApi } from "../../utils/socket";

import Peer from "simple-peer";
import { useParams } from "react-router-dom";

export default function Video() {
  const { roomId } = useParams();

  const userVideo = useRef();
  const teamPlayerVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;

      socketApi.findCurrentJoiningRoom(roomId);

      socket.on("send-current-joining-room", payload => {
        if (socket.id === payload.policeId[0]) {
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
          });

          peer.on("signal", signal => {
            socketApi.sendingSignalToConnectWebRTC({ userToSignal: payload.policeId[1], callerID: socket.id, signal });
          });

          socket.on("receiving-returned-signal-to-connect-webRTC", payload => {
            peer.signal(payload.signal);
          });

          peer.on("stream", stream => {
            teamPlayerVideo.current.srcObject = stream;
          });
        }
      });

      socket.on("new-video-chat-participant", payload => {
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
        });

        peer.on("signal", signal => {
          socketApi.returningSignalToConnectWebRTC({ signal, callerID: payload.callerID });
        });

        peer.signal(payload.signal);

        peer.on("stream", stream => {
          teamPlayerVideo.current.srcObject = stream;
        });
      });
    });

    return () => {
      socket.off("send-current-joining-room");
      socket.off("new-video-chat-participant");
      socket.off("receiving-returned-signal-to-connect-webRTC");
    };
  }, []);

  return (
    <VideoWrap>
      <div>
        <video playsInline autoPlay ref={userVideo} />
      </div>
      <div>
        <video playsInline autoPlay ref={teamPlayerVideo} />
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
