import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import Nav from "./Nav";
import { FaMicrophone } from 'react-icons/fa';
import { useSpeechSynthesis } from 'react-speech-kit';
import '../css/Chatbot.css';
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

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

  // Intelligent offline counselor response engine
  const getEmpatheticFallback = (userText) => {
    const text = userText.toLowerCase();

    // Crisis detection
    if (text.includes("suicide") || text.includes("kill myself") || text.includes("end my life") || text.includes("die") || text.includes("hurt myself")) {
      return "I hear how intensely heavy things feel right now, but please know you do not have to carry this alone. Your life has profound value. Please reach out right now to caring professionals: 📞 Kiran Helpline: 1800-599-0019 | Tele-MANAS: 14416 | Global: 988 Lifeline. Help is available 24/7, confidential and free.";
    }

    // Anxiety & Panic
    if (text.includes("anxious") || text.includes("anxiety") || text.includes("panic") || text.includes("stress") || text.includes("overwhelm") || text.includes("racing")) {
      return "It is completely understandable to feel overwhelmed. Right now, let's bring your nervous system back to safety. Place your feet firmly on the floor. Take a slow inhale through your nose for 4 counts, hold for 4, and exhale gently for 6. Can you name 3 objects you can see around you right now? 🌿";
    }

    // Sadness & Depressive feelings
    if (text.includes("sad") || text.includes("cry") || text.includes("crying") || text.includes("hopeless") || text.includes("depress") || text.includes("unhappy")) {
      return "I am sitting with you in this feeling. It takes courage to acknowledge sadness. You don't have to fix everything right this moment. Give yourself permission to feel, wrap yourself in warmth, and take things one gentle moment at a time. What would feel kindest to your soul right now?";
    }

    // Sleep & Insomnia
    if (text.includes("sleep") || text.includes("insomnia") || text.includes("tired") || text.includes("night") || text.includes("exhausted")) {
      return "Rest can feel so elusive when our mind is full. Try unclenching your jaw, letting your shoulders drop away from your ears, and softening your forehead. Would you like to try 5 minutes in our Guided Meditation chamber (4-7-8 breathing) to help you drift off peacefully?";
    }

    // Loneliness & Isolation
    if (text.includes("lonely") || text.includes("alone") || text.includes("nobody") || text.includes("isolated")) {
      return "Feeling lonely can be an ache, but please know that you are not invisible. You are part of our Sahaya community. I am here listening to you, and our Peer Support Lounge has fellow members who understand what you are experiencing. You matter deeply here.";
    }

    // Gratitude & Positivity
    if (text.includes("thank") || text.includes("good") || text.includes("happy") || text.includes("better") || text.includes("great") || text.includes("calm")) {
      return "It warms my heart to hear that! Celebrate this peaceful moment, anchor the feeling in your chest, and carry it gently into the rest of your day. How else can I support your journey?";
    }

    // Default Empathetic Response
    return "Thank you for sharing that with me. It takes real courage to put feelings into words. Take a slow, grounding breath. Whatever is on your mind, I am here without judgment. How does your body feel as you reflect on this?";
  };

  const processMessageToChatBOT = async (chatMessages) => {
    const lastUserMessage = chatMessages[chatMessages.length - 1]?.message || "";

    const apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === chatbotName ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    try {
      // Secure Backend Proxy Call (Defends against VAPT #18 Information Disclosure & #30 LLM Attacks)
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.success && data?.reply) {
          setMessages([
            ...chatMessages,
            {
              message: data.reply,
              sender: chatbotName
            }
          ]);
          setIsTyping(false);
          return;
        }
      }

      // If backend is in offline mode or returns non-200, engage empathetic offline counselor
      setTimeout(() => {
        setMessages([
          ...chatMessages,
          {
            message: getEmpatheticFallback(lastUserMessage),
            sender: chatbotName
          }
        ]);
        setIsTyping(false);
      }, 500);

    } catch (error) {
      console.warn("Backend AI chat fallback to offline counselor:", error.message);
      setMessages([
        ...chatMessages,
        {
          message: getEmpatheticFallback(lastUserMessage),
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
