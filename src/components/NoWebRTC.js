import React from "react";

const NoWebRTC = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "1em"
      }}
    >
      <h1>Oops...</h1>
      <br />
      <h2>
        Your Browser does not support <i>WebRTC</i>
      </h2>
      <br />
      <h3>
        Please use other browser like:{" "}
        <a
          href="https://www.google.com/chrome/"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          Chrome
        </a>
        ,{" "}
        <a
          href="https://www.mozilla.org/pl/firefox/"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          Firefox
        </a>{" "}
        or{" "}
        <a
          href="https://www.opera.com/"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          Opera
        </a>
      </h3>
      <br />
    </div>
  );
};

export default NoWebRTC;
