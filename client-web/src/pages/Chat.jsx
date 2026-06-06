import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

import socket from "../socket";

function Chat() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  // RECEIVE REAL-TIME MESSAGES
  useEffect(() => {

    socket.on("receive_message", (data) => {

      setMessages((prev) => [...prev, data]);

    });

    return () => {

      socket.off("receive_message");

    };

  }, []);

  // SEND MESSAGE
  const sendMessage = () => {

    if (!message.trim()) return;

    const messageData = {

      sender: user._id,

      username: user.username,

      avatar: user.avatar,

      text: message,

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

      <button onClick={handleLogout}>
        Logout
      </button>

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

  return (

    <div
      key={index}
      style={{
        display: "flex",
        justifyContent:
          isMine
            ? "flex-end"
            : "flex-start",
        marginBottom: "15px",
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          maxWidth: "70%",
          background:
            isMine
              ? "#DCF8C6"
              : "#F1F1F1",
          padding: "10px",
          borderRadius: "12px",
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

          <p style={{ margin: 0 }}>
            {msg.text}
          </p>

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






