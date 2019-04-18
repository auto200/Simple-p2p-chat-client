import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { StoreContext } from "../Store";
import { SET_USER_NAME } from "../ActionTypes";

const LoginForm = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: solid #333333;
  border-width: 2px 0 0px;
  text-align: center;
  font-size: 2em;
  color: #e8e7e3;
  background-color: #1b1c21;
`;
const Button = styled.button`
  color: #333333;
  font-size: 1em;
  border-radius: 0.5em;
  padding: 0.2em;
  margin-top: 0.5em;
`;
const Input = styled.input`
  text-align: center;
  color: #e8e7e3;
  font-size: 0.7em;
  border-radius: 4px;
  background-color: #252a33;
`;

const GetUserName = () => {
  const [, dispatch] = useContext(StoreContext);

  const [userName, setUserName] = useState("");

  const handleChange = e => {
    if (userName.length < 25) setUserName(e.target.value);
    else console.log("error name too long");
  };
  const handleSubmit = e => {
    e.preventDefault();
    dispatch({ type: SET_USER_NAME, payload: userName });
  };

  const inputRef = React.createRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <LoginForm onSubmit={handleSubmit}>
      <label>
        <div>Your name:</div>
        <Input
          type="text"
          value={userName}
          onChange={handleChange}
          ref={inputRef}
        />
      </label>
      <Button>Login</Button>
    </LoginForm>
  );
};

export default GetUserName;
