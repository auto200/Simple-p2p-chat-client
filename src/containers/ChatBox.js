import React, { useEffect, useState, useRef, useContext } from "react";
import Message from "../components/Message";
import ScrollToBottomButton from "../components/ScrollToBottomButton";
import AloneInTheChat from "../components/AloneInTheChat";
import styled from "styled-components";
import throttle from "lodash.throttle";
import { StoreContext } from "../Store";
import messageTypes from "../messageTypes";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-style: solid;
  border-color: #333333;
  border-width: 2px 0 0px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #1b1c21;
`;

const ChatBox = () => {
  const [state] = useContext(StoreContext);

  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(
    false
  );

  const chatBoxRef = useRef();

  useEffect(() => {
    if (!state.messages.length) return;
    if (
      state.messages[state.messages.length - 1].origin ===
      messageTypes.MY_MESSAGE
    )
      scrollToBottom();
    else {
      const chatRef = chatBoxRef.current;
      const formula = chatRef.scrollTop + chatRef.clientHeight;
      if (formula + 100 > chatRef.scrollHeight) scrollToBottom();
    }
  }, [state.messages]);

  function scrollToBottom() {
    const elementRef = chatBoxRef.current;
    elementRef.scrollTop = elementRef.scrollHeight;
  }

  useEffect(() => {
    chatBoxRef.current.addEventListener(
      "scroll",
      throttle(checkIfShowScrollToBottomButton, 300)
    );

    return () =>
      chatBoxRef.current.removeEventListener(
        "scroll",
        throttle(checkIfShowScrollToBottomButton, 500)
      );
  }, []);

  function checkIfShowScrollToBottomButton() {
    const chatRef = chatBoxRef.current;
    const formula = chatRef.scrollTop + chatRef.clientHeight;
    if (formula + 200 < chatRef.scrollHeight) setShowScrollToBottomButton(true);
    else setShowScrollToBottomButton(false);
  }

  return (
    <Container ref={chatBoxRef}>
      {state.isAloneInTheChat && <AloneInTheChat />}
      {state.messages.map(message => {
        return <Message messageObject={message} key={message.id} />;
      })}
      {showScrollToBottomButton && (
        <ScrollToBottomButton onClick={scrollToBottom} />
      )}
    </Container>
  );
};

export default ChatBox;
