import React, { useState, useRef } from "react";
import Input from "../components/Input";
import SendButton from "../components/SendButton";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-flow: row;
`;

const BottomRow = props => {
  const [userInput, setUserInput] = useState("");
  const inputFieldRef = useRef();

  const broadcast = () => {
    const text = userInput.trim();
    if (text) props.createAndBroadcastTextMessage(text);
    setUserInput("");
    inputFieldRef.current.focus();
  };
  return (
    <Container>
      <Input
        ref={inputFieldRef}
        broadcast={broadcast}
        userInput={userInput}
        setUserInput={setUserInput}
      />
      <SendButton onClick={broadcast} />
    </Container>
  );
};

export default BottomRow;
