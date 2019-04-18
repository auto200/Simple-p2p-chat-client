import uuid from "uuid/v4";
import messageTypes from "./messageTypes";
function getTimeString() {
  return new Date().toLocaleTimeString();
}
//JOIN_MESSAGE, LEAVE_MESSAGE
export const createSpecialMessage = (type = "", userName = "", userId = "") => {
  return {
    id: uuid(),
    type,
    time: getTimeString(),
    userName,
    userId
  };
};
//TEXT_MESSAGE
export const createTextMessage = (text = "", userName = "") => {
  return {
    id: uuid(),
    type: messageTypes.TEXT_MESSAGE,
    userName,
    origin: null,
    time: getTimeString(),
    text
  };
};
