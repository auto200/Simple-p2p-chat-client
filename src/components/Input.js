import React, { useEffect } from "react";
import styled from "styled-components";

const TextArea = styled.textarea`
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  flex: 1;
  height: 4rem;
  font-size: 1.3em;
  color: #e8e7e3;
  width: 100%;
  resize: none;
  padding: 0.4rem;
  box-sizing: border-box;
  background: #252a33;
`;

const Input = props => {
  const handleChange = e => {
    if (e.keyCode === 13 && e.shiftKey === false) e.preventDefault();
    else props.setInput(e.target.value);
  };

  const handleSubmit = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      props.broadcast();
    }
  };

  const inputRef = React.createRef();
  useEffect(() => {
    inputRef.current.focus();
  });

  return (
    <TextArea
      id="input-field"
      ref={inputRef}
      value={props.input}
      onKeyDown={handleSubmit}
      onChange={handleChange}
      placeholder="type here ......................"
    />
  );
};

export default Input;
