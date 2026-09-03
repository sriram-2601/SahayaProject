import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import Nav from "./Nav";
import { FaMicrophone } from 'react-icons/fa';
import { useSpeechSynthesis } from 'react-speech-kit';
import '../css/Chatbot.css';
import { useNavigate } from "react-router-dom";

const API_KEY = process.env.REACT_APP_GROQ_API_KEY;

const systemMessage = {
  role: "system",
  content: "Hello! I’m Sahaya, your empathetic mental health support assistant. I am here to provide a safe, non-judgmental space, listen actively, and guide you with calming reassurance. If you are in crisis, I will gently suggest professional helplines."
};

function Chatbot() {
  const storedChatbotName = localStorage.getItem("chatbotName");
  const [chatbotName, setChatbotName] = useState(storedChatbotName || "Sahaya");
  const [isNameSet, setIsNameSet] = useState(Boolean(storedChatbotName));
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      message: `Hello! I'm ${storedChatbotName || "Sahaya"}, your mental health companion. How are you feeling right now? I'm here to listen.`,
      sentTime: "just now",
      sender: storedChatbotName || "Sahaya"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    if (storedChatbotName) {
      setChatbotName(storedChatbotName);
      setIsNameSet(true);
    }
  }, [storedChatbotName]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!chatbotName.trim()) return;
    localStorage.setItem("chatbotName", chatbotName.trim());
    setIsNameSet(true);
    setMessages(prevMessages => [
      ...prevMessages,
      {
        message: `Hello! I am ${chatbotName}. How can I support your peace of mind today?`,
        sentTime: "just now",
        sender: chatbotName
      }
    ]);
  };

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    await processMessageToChatBOT(newMessages);
  };

  const processMessageToChatBOT = async (chatMessages) => {
    const apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === chatbotName ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "llama3-8b-8192",
      messages: [
        systemMessage,
        ...apiMessages
      ]
    };

    try {
      if (!API_KEY) {
        // Provide thoughtful empathetic fallback response if no API key is configured
        setTimeout(() => {
          setMessages([
            ...chatMessages,
            {
              message: "Thank you for sharing that with me. It takes courage to open up. Remember to breathe deeply, be patient with yourself, and know that you are not alone on this journey. How does your body feel as you reflect on this?",
              sender: chatbotName
            }
          ]);
          setIsTyping(false);
        }, 1000);
        return;
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });

      const data = await response.json();

      if (data?.choices?.[0]?.message?.content) {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: chatbotName
          }
        ]);
      }
      setIsTyping(false);
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages([
        ...chatMessages,
        {
          message: "I hear you, and I appreciate you sharing your thoughts. Take a moment to breathe. Even on tough days, your well-being matters deeply.",
          sender: chatbotName
        }
      ]);
      setIsTyping(false);
    }
  };

  const handleOnClick = () => {
    if (messages.length > 0) {
      speak({ text: messages[messages.length - 1].message });
    }
  };

  return (
    <>
      <Nav chatbotName={chatbotName} />

      <div className="chatbot-page-wrapper">
        <div className="chatbot-wrapper-container">
          <div className="chatbot-card">
            {/* Header */}
            <div className="chatbot-card-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">🌱</div>
                <div className="chatbot-header-text">
                  <h3>{chatbotName}</h3>
                  <p>
                    <span className="status-dot"></span> Online & Listening Empathetically
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                {!isNameSet && (
                  <button
                    onClick={() => setIsNameSet(false)}
                    style={{
                      padding: "6px 12px",
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                    }}
                  >
                    Rename
                  </button>
                )}
              </div>
            </div>

            {/* Rename Modal if name not set */}
            {!isNameSet && (
              <div className="chatbot-name-modal">
                <h3>Personalize Your Companion</h3>
                <p>Choose a comforting name for your AI companion:</p>
                <form onSubmit={handleNameSubmit} className="chatbot-name-form">
                  <input
                    type="text"
                    placeholder="Companion Name"
                    value={chatbotName}
                    onChange={(e) => setChatbotName(e.target.value)}
                    className="chatbot-name-input"
                    required
                  />
                  <button type="submit" className="chatbot-name-submit">
                    Save
                  </button>
                </form>
              </div>
            )}

            {/* Chat Body */}
            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
              <MainContainer>
                <ChatContainer>
                  <MessageList
                    scrollBehavior="smooth"
                    typingIndicator={
                      isTyping ? <TypingIndicator content={`${chatbotName} is reflecting...`} /> : null
                    }
                  >
                    {messages.map((message, i) => (
                      <Message
                        key={i}
                        model={{
                          message: message.message,
                          sentTime: message.sentTime,
                          sender: message.sender,
                          direction: message.sender === "user" ? "outgoing" : "incoming"
                        }}
                      />
                    ))}
                  </MessageList>
                  <MessageInput
                    placeholder="Express your thoughts freely here..."
                    value={inputValue}
                    onChange={(val) => setInputValue(val)}
                    onSend={handleSend}
                    attachButton={false}
                  />
                </ChatContainer>
              </MainContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Speak & Back Controls */}
      <button className="peaceful-speak-btn" onClick={handleOnClick} title="Listen to last message">
        <FaMicrophone /> Speak
      </button>

      <button className="peaceful-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
    </>
  );
}

export default Chatbot;
