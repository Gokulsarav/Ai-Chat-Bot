import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const data = {
      contents: [
        {
          parts: [
            {
              text: input,
            },
          ],
        },
      ],
    };

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyD3MdTZMdTiJXX1YIrqD91kyAuWUCJo6cc",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const reply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received.";
      setMessages([...newMessages, { sender: "assistant", text: reply }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([
        ...newMessages,
        { sender: "assistant", text: "Error: Unable to fetch a response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect( () => {
    document.title = "Ai Chat Bot";
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="d-flex flex-column vh-100 text-light"
      style={{ background: "linear-gradient(135deg, #1f1c2c, #928DAB)" }}
    >
      <motion.header
        className="text-white text-center py-4 shadow"
        style={{ background: "linear-gradient(90deg, #0072ff, #00c6ff)" }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="fw-bold display-6">Miruthula's AI Chat</h1>
      </motion.header>

      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-between p-3">
        <motion.div
          className="chat-box w-100 rounded p-4 shadow-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            maxHeight: "70vh",
            overflowY: "auto",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`d-flex ${
                msg.sender === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              } mb-3`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`p-3 rounded-4 shadow text-break ${
                  msg.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-dark text-white"
                }`}
                style={{
                  maxWidth: "70%",
                  fontSize: "1.05rem",
                  transition: "transform 0.2s",
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="text-center text-info">
              <span>Generating response...</span>
            </div>
          )}
        </motion.div>

        <div className="d-flex justify-content-center mt-3">
          <motion.div
            className="input-group shadow-lg w-50"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              value={input}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInput(e.target.value)}
              className="form-control border-0"
              placeholder="Type a message..."
              style={{
                borderRadius: "20px 0 0 20px",
                padding: "15px",
                backgroundColor: "rgba(255,255,255,0.9)",
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="btn fw-bold text-white"
              style={{
                background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                borderRadius: "0 20px 20px 0",
                padding: "15px 30px",
                transition: "0.3s",
              }}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </motion.div>
        </div>
      </main>

      <footer
        className="text-white text-center py-3 shadow-lg mt-auto"
        style={{ background: "linear-gradient(90deg, #232526, #414345)" }}
      >
        <small className="fw-bold">&copy; 2025 GM</small>
      </footer>
    </div>
  );
};

export default ChatComponent;
