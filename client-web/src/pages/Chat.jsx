import { useEffect, useRef, useState } from "react";

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

import socket from "../socket";

function Chat() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  // RECEIVE REAL-TIME MESSAGES
  useEffect(() => {

    socket.on("receive_message", (data) => {

      setMessages((prev) => [...prev, data]);

    });

    return () => {

      socket.off("receive_message");

    };

  }, []);


  useEffect(() => {

  messagesEndRef.current
    ?.scrollIntoView({
      behavior: "smooth",
    });

}, [messages]);

  // SEND MESSAGE
  const sendMessage = () => {

    if (!message.trim()) return;

    const messageData = {

      sender: user._id,

      username: user.username,

      avatar: user.avatar,

      text: message,

      createdAt: new Date(),

    };

    socket.emit("send_message", messageData);

    setMessage("");

  };

  // LOGOUT
  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  return (

    <div style={{ padding: 20 }}>

      <h1>Real-Time Chat</h1>

      
  <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <img
      src={
        user.avatar
          ? user.avatar
          : `https://ui-avatars.com/api/?name=${user.username}`
      }
      alt="avatar"
      width="60"
      height="60"
      style={{
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />

    <div>
      <h3 style={{ margin: 0 }}>
        {user.username}
      </h3>

      <p
        style={{
          margin: 0,
          color: "gray",
        }}
      >
        {user.email}
      </p>
    </div>
  </div>

  <button onClick={handleLogout}>
    Logout
  </button>
</div>

      <hr />

      {/* CHAT BOX */}
      <div
        style={{
          height: "400px",
          border: "1px solid gray",
          overflowY: "scroll",
          padding: "10px",
          marginBottom: "10px",
        }}
      >

        {messages.map((msg, index) => {

  const isMine =
    msg.sender === user._id;


    const formatTime = (date) => {

  return new Date(date)
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

};

  return (

    <div
      key={index}
      style={{
        display: "flex",
        justifyContent:
          isMine
            ? "flex-end"
            : "flex-start",
        marginBottom: "10px",
      }}
    >

      <div ref={messagesEndRef} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          maxWidth: "300%",
          background:
            isMine
              ? "#DCF8C6"
              : "#F1F1F1",
          padding: "10px",
          borderRadius: "10px",
        }}
      >

        <img
          src={
            msg.avatar
              ? msg.avatar
              : `https://ui-avatars.com/api/?name=${msg.username}`
          }
          alt="avatar"
          width="40"
          height="40"
          style={{
            borderRadius: "50%",
            marginRight: "10px",
            objectFit: "cover",
          }}
        />

        <div>

          <strong>
            {msg.username}
          </strong>

          <p>
  {msg.text}
</p>

<small
  style={{
    color: "#777",
    fontSize: "10px",
    display: "block",
    textAlign: "right",
    marginTop: "4px",
  }}
>
  {formatTime(msg.createdAt)}
</small>
        </div>

      </div>

    </div>

  );

})}
      </div>

      {/* INPUT */}
      <div>

        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}

export default Chat;






