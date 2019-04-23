// @ts-check

import React, { useEffect, useRef, useContext } from "react";
import SimplePeer from "simple-peer";
import io from "socket.io-client";
import "./style.css";
import Header from "./containers/Header";
import GetUserName from "./components/GetUserName";
import ChatBox from "./containers/ChatBox";
import BottomRow from "./containers/BottomRow";
import NoWebRTC from "./components/NoWebRTC";
import events from "./events";
import messageTypes from "./messageTypes";
import { createSpecialMessage, createTextMessage } from "./factories";
import { StoreContext } from "./Store";
import {
  SET_SOCKET,
  ADD_USERS_INFO,
  DELETE_USERS_INFO,
  ADD_MESSAGE,
  ALONE_IN_THE_CHAT
} from "./ActionTypes";

const App = () => {
  if (!SimplePeer.WEBRTC_SUPPORT) return <NoWebRTC />;

  const connections = useRef([]);
  // @ts-ignore
  const [state, dispatch] = useContext(StoreContext); //weird error, idk
  // @ts-ignore
  window.conns = connections.current;
  // @ts-ignore
  window.msgs = state.messages;
  // @ts-ignore
  window.uinfo = state.usersInfo;
  // @ts-ignore
  window.alone = state.isAloneInTheChat;
  // @ts-ignore
  window.state = state;
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!state.usersInfo) return;
    if (state.usersInfo.length > 0)
      dispatch({ type: ALONE_IN_THE_CHAT, payload: false });
    else dispatch({ type: ALONE_IN_THE_CHAT, payload: true });
  }, [state.usersInfo]);

  //TODO: figure out better way to do it
  useEffect(() => {
    if (state.userName) {
      dispatch({
        type: SET_SOCKET,
        //you can just use "localhost:PORT" but you won't be able to connect from other devices
        // payload: io("192.168.0.103:3000")
        payload: io("https://simple-chat-signaling-server.herokuapp.com/")
      });
    }
  }, [state.userName]);

  useEffect(() => {
    if (state.socket) {
      console.log("setting up socket listeners");

      state.socket.on(events.SOCKET_CREATED, () => {
        console.log("waiting for more users");
      });
      state.socket.on(events.CREATE_NEW_PIPE, ({ pipeId, initiator }) => {
        console.log("creating new pipe");
        if (typeof connections.current[pipeId] == "undefined") {
          connections.current[pipeId] = new SimplePeer({
            initiator
          });
          //note that "connections.current[pipeId]" is an object so it's passed by reference,
          //it mutates and doesn't need to be returned from setUpPipeListeners()
          setUpPipeListeners(connections.current[pipeId], pipeId);
        }
      });
      state.socket.on(events.SIGNAL, ({ signalingData, pipeId }) => {
        //check if given pipe exists
        // console.log("signal message", connections.current);
        if (typeof connections.current[pipeId] == "object")
          connections.current[pipeId].signal(signalingData);
      });
      state.socket.on(events.SOCKET_ERROR, err => {
        console.log("socket.IO Error");
        console.dir(err);
      });
    }
  }, [state.socket]);

  function setUpPipeListeners(pipe, pipeId) {
    pipe.on(events.SIGNAL, signalingData => {
      state.socket.emit(events.SIGNAL, { signalingData, pipeId });
      console.log("signaling");
    });
    pipe.on(events.PIPE_CONNECT, () => {
      console.log("connected");
      //send welcome message
      const joinMessage = createSpecialMessage(
        messageTypes.JOIN_MESSAGE,
        state.userName,
        state.socket.id
      );
      sendMessageTo(pipe, joinMessage);
    });
    pipe.on(events.PIPE_DATA, messageObject => {
      try {
        const newMessage = JSON.parse(messageObject);
        newMessage.origin = messageTypes.FOREIGN_MESSAGE;
        // console.log(newMessage);

        if (!newMessage.type)
          throw new Error(
            "invalid or corrupted data, message type not specified"
          );
        //save info about new connected user
        if (newMessage.type === messageTypes.JOIN_MESSAGE) {
          dispatch({
            type: ADD_USERS_INFO,
            payload: {
              pipeId,
              userName: newMessage.userName,
              userId: newMessage.id
            }
          });
        }

        dispatch({ type: ADD_MESSAGE, payload: newMessage });

        //TODO:
        //check if given object is valid message object - never trust user input
        //for the future: determine if it's data stream - media (image, audio, video) file or text message
      } catch (err) {
        console.dir(err);
        console.log("other user provided invalid data");
      }
    });
    pipe.on(events.PIPE_ERROR, err => {
      // note that this fires every time before PIPE_CLOSE
      console.dir(err);
    });
    pipe.on(events.PIPE_CLOSE, () => {
      console.log("-------------disconnect message============");
      const [otherUserInfo] = stateRef.current.usersInfo.filter(
        info => info.pipeId === pipeId
      );
      if (otherUserInfo) {
        let leaveMessage = createSpecialMessage(
          messageTypes.LEAVE_MESSAGE,
          otherUserInfo.userName
        );
        dispatch({ type: ADD_MESSAGE, payload: leaveMessage });
      }

      dispatch({ type: DELETE_USERS_INFO, payload: pipeId });
      delete connections.current[pipeId];
    });
  }
  function sendMessageTo(pipe, messageObject) {
    const stringifiedObject = JSON.stringify(messageObject);
    if (pipe.connected) pipe.send(stringifiedObject);
  }
  function broadcastMessage(messageObject) {
    const objectString = JSON.stringify(messageObject);
    const pipes = Object.keys(connections.current);

    pipes.forEach(pipe => {
      if (connections.current[pipe].connected) {
        connections.current[pipe].send(objectString);
      }
    });
  }
  function createAndBroadcastTextMessage(text) {
    const newMessage = createTextMessage(text, state.userName);
    broadcastMessage(newMessage);
    newMessage.origin = messageTypes.MY_MESSAGE;
    dispatch({ type: ADD_MESSAGE, payload: newMessage });
  }

  return (
    <div id="container">
      <Header />
      {state.userName ? <ChatBox /> : <GetUserName />}
      {state.userName && (
        <BottomRow
          createAndBroadcastTextMessage={createAndBroadcastTextMessage}
        />
      )}
    </div>
  );
};

export default App;
