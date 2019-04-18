import React, { useState } from "react";
import Input from "../components/Input";
import SendButton from "../components/SendButton";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-flow: row;
`;

const BottomRow = props => {
  const [input, setInput] = useState("");

  const broadcast = () => {
    const text = input.trim();
    if (text) props.createAndBroadcastTextMessage(text);
    setInput("");
  };
  return (
    <Container>
      <Input broadcast={broadcast} input={input} setInput={setInput} />
      <SendButton broadcast={broadcast} />
    </Container>
  );
};

export default BottomRow;
