import React from "react";
import styled from "styled-components";

const Alone = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 2rem;
  color: white;
  opacity: 0.7;
`;

const AloneInTheChat = () => {
  return <Alone>You are alone in the chat, open this page in new tab!</Alone>;
};

export default AloneInTheChat;
