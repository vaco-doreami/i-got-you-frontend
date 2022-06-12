import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { socket } from "../../utils/socket";
import Peer from "simple-peer";

import { socketApi } from "../../utils/socket";

export default function Video() {
  const { roomId } = useParams();

  const userVideo = useRef();
  const teamPlayerVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;

      socketApi.findCurrentJoiningRoom(roomId);

      socket.on("send-current-joining-room", payload => {
        const teamplayerId = payload.policeId.find(id => id !== socket.id);

        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
        });

        peer.on("signal", signal => {
          socketApi.sendingSignalToConnectWebRTC(teamplayerId, socket.id, signal);
        });

        peer.on("stream", stream => {
          teamPlayerVideo.current.srcObject = stream;
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
          socketApi.returningSignalToConnectWebRTC(signal, payload.callerID);
        });

        peer.on("stram", stream => {
          teamPlayerVideo.current.srcObject = stream;
        });

        peer.signal(payload.signal);
      });
    });
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
