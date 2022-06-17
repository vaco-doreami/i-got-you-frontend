import Peer from "simple-peer";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket, socketApi } from "../../utils/socket";
import { NEW_VIDEO_CHAT_PARTICIPANT, RECEIVING_RETURNED_SIGNAL_TO_CONNECT_WEBRTC, SEND_ENTERED_ROOM } from "../../constants/socket";
import styled from "styled-components";

export default function Video() {
  const { roomId } = useParams();

  const userVideo = useRef();
  const teamPlayerVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;

        socketApi.findEnteredRoom(roomId);

        socket.on(SEND_ENTERED_ROOM, payload => {
          if (socket.id === payload.policeId[0]) {
            const peer = new Peer({
              initiator: true,
              trickle: false,
              stream,
            });

            peer.on("signal", signal => {
              socketApi.sendingSignalToConnectWebRTC({ userToSignal: payload.policeId[1], callerID: socket.id, signal });
            });

            socket.on(RECEIVING_RETURNED_SIGNAL_TO_CONNECT_WEBRTC, payload => {
              peer.signal(payload.signal);
            });

            peer.on("stream", stream => {
              teamPlayerVideo.current.srcObject = stream;
            });
          }
        });

        socket.on(NEW_VIDEO_CHAT_PARTICIPANT, payload => {
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
      }
    });

    return () => {
      userVideo.current = null;
      teamPlayerVideo.current = null;

      socket.off(SEND_ENTERED_ROOM);
      socket.off(NEW_VIDEO_CHAT_PARTICIPANT);
      socket.off(RECEIVING_RETURNED_SIGNAL_TO_CONNECT_WEBRTC);
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
