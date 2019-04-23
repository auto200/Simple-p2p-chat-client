import React from "react";
import styled from "styled-components";
import messageTypes from "../messageTypes";
import Linkify from "linkifyjs/react"; //https://soapbox.github.io/linkifyjs/

const Message = React.memo(props => {
  const message = props.messageObject;

  const foreignMessage = message.origin === messageTypes.FOREIGN_MESSAGE;

  const MessageWrapper = styled.div`
    margin-left: ${foreignMessage ? null : "auto"};
    margin-right: ${foreignMessage ? "auto" : null};
    max-width: ${foreignMessage ? "55%" : "60%"};
    word-wrap: break-word;
    padding: 0.7em;
  `;
  const UserName = styled.div`
    font-family: Helvetica;
    font-size: 0.9em;
    color: #e8e7e3;
    margin-left: 0.2em;
  `;
  const Text = styled.div`
    font-size: 1.4em;
    color: #e8e7e3;
    border-radius: 0.6em;
    background-color: ${foreignMessage ? "#302d26" : "#252a33"};
    padding: 0.3em;
  `;
  const SpecialMessage = styled.div`
    margin-left: auto;
    margin-right: auto;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    font-size: 0.8em;
    color: #e8e6e3;
    padding: 0.4em;
  `;
  const linkOptions = {
    attributes: {
      rel: "noopener noreferrer nofollow"
    },
    validate: {
      //do not hyperlink emails
      email: false,
      //hyperlink only if starts with protocol eg. google.com, www.google.com won't work. https://www.google.com/ will be clickable
      url: value => /^(http|ftp)s?:\/\//.test(value)
    }
  };
  if (
    message.type === messageTypes.JOIN_MESSAGE ||
    message.type === messageTypes.LEAVE_MESSAGE
  ) {
    return (
      <SpecialMessage title={message.time}>
        {message.userName} -{" "}
        {message.type === messageTypes.JOIN_MESSAGE ? "Joined" : "Left"}
      </SpecialMessage>
    );
  }
  // if (message.type === messageTypes.LEAVE_MESSAGE) {
  //   return (
  //     <SpecialMessage title={message.time}>
  //       {message.userName} - Left
  //     </SpecialMessage>
  //   );
  // }
  if (message.type === messageTypes.TEXT_MESSAGE) {
    return (
      <MessageWrapper title={message.time}>
        {foreignMessage && <UserName>{message.userName}</UserName>}
        <Text>
          <Linkify options={linkOptions}>{message.text}</Linkify>
        </Text>
      </MessageWrapper>
    );
  }
  return null;
});
export default Message;
