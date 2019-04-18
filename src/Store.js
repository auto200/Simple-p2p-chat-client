import React, { createContext, useReducer } from "react";
import {
  SET_USER_NAME,
  SET_SOCKET,
  ADD_USERS_INFO,
  DELETE_USERS_INFO,
  ADD_MESSAGE,
  SET_IS_ALONE_IN_THE_CHAT
} from "./ActionTypes";

export const StoreContext = createContext({});

const initialState = {
  userName: "",
  socket: null,
  connections: [],
  usersInfo: [],
  messages: [],
  isAloneInTheChat: true
};

function reducer(state, action) {
  switch (action.type) {
    case SET_USER_NAME:
      return { ...state, userName: action.payload };
    case SET_SOCKET:
      return { ...state, socket: action.payload };
    case ADD_USERS_INFO:
      return { ...state, usersInfo: [...state.usersInfo, action.payload] };
    case DELETE_USERS_INFO:
      const newInfo = state.usersInfo.filter(
        info => info.pipeId !== action.payload
      );
      return { ...state, usersInfo: newInfo };
    case ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case SET_IS_ALONE_IN_THE_CHAT:
      return { ...state, isAloneInTheChat: action.payload };
    default:
      throw new Error("you need to provide valid action type");
  }
}

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};

export default Store;
