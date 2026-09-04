import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "./Firebase";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  increment 
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import "../css/ChatApplication.css";

const defaultSampleMessages = [
  {
    id: "sample-1",
    authorName: "Ananya",
    text: "Good morning everyone. Remember to take a mindful breath and be gentle with yourself today. 🌿",
    time: "10:15 AM",
    reactions: { heart: 4, hug: 2, peace: 5 },
    isAnonymous: false,
    userId: "demo-user-1",
  },
  {
    id: "sample-2",
    authorName: "Mindful Seeker",
    text: "Was feeling overwhelmed by deadlines, but stepped outside for 5 minutes. Fresh air helps grounding.",
    time: "10:24 AM",
    reactions: { heart: 3, hug: 6 },
    isAnonymous: true,
    userId: "demo-user-2",
  },
  {
    id: "sample-3",
    authorName: "Dr. Sarah Jenkins",
    text: "You don't have to carry every worry at once. Just focus on what is right in front of you right now. 💚",
    time: "10:30 AM",
    reactions: { heart: 8, peace: 7, bloom: 4 },
    isAnonymous: false,
    userId: "demo-user-3",
  }
];

const starterPrompts = [
  "🌿 Sending warmth to whoever needs reassurance today.",
  "✨ Just taking a deep breath and letting go of what I cannot control.",
  "🫂 Reminding myself: It's okay to rest.",
  "🌱 Progress is progress, no matter how small."
];

const ChatApplication = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(() => {
    return localStorage.getItem("sahaya_chat_anon") === "true";
  });
  const [userName, setUserName] = useState("Wellness Seeker");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user name
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split("@")[0] || "Care Member");
      } else {
        const localProfile = localStorage.getItem("sahaya_profile");
        if (localProfile) {
          try {
            const p = JSON.parse(localProfile);
            if (p.firstName) setUserName(p.firstName);
          } catch (e) {}
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync
  useEffect(() => {
    try {
      const q = query(
        collection(db, "community_messages"),
        orderBy("timestamp", "asc"),
        limit(60)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const loaded = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              const timeStr = data.createdAt?.toDate 
                ? data.createdAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "Just now";
              return {
                id: docSnap.id,
                ...data,
                time: timeStr,
              };
            });
            setMessages(loaded);
            localStorage.setItem("sahaya_community_chats", JSON.stringify(loaded));
          } else {
            // If collection empty in firestore, check local cache or use sample
            const cached = localStorage.getItem("sahaya_community_chats");
            setMessages(cached ? JSON.parse(cached) : defaultSampleMessages);
          }
        },
        (error) => {
          console.warn("Firestore real-time chat fallback to local cache:", error.message);
          const cached = localStorage.getItem("sahaya_community_chats");
          setMessages(cached ? JSON.parse(cached) : defaultSampleMessages);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn("Real-time listener setup fallback:", err);
      const cached = localStorage.getItem("sahaya_community_chats");
      setMessages(cached ? JSON.parse(cached) : defaultSampleMessages);
    }
  }, []);

  // Toggle anonymous mode
  const handleTogglePrivacy = () => {
    const nextVal = !isAnonymous;
    setIsAnonymous(nextVal);
    localStorage.setItem("sahaya_chat_anon", String(nextVal));
  };

  // Send message
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const author = isAnonymous ? "Mindful Seeker" : userName;
    const currentUid = auth.currentUser?.uid || "guest";

    const newMsgObj = {
      authorName: author,
      text,
      isAnonymous,
      userId: currentUid,
      createdAt: new Date(),
      reactions: { heart: 0, hug: 0, peace: 0 },
    };

    // Optimistic local update
    const displayMsg = {
      ...newMsgObj,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [...messages, displayMsg];
    setMessages(updated);
    localStorage.setItem("sahaya_community_chats", JSON.stringify(updated));
    setInputText("");

    // Send to Firestore
    try {
      await addDoc(collection(db, "community_messages"), {
        ...newMsgObj,
        timestamp: serverTimestamp(),
      });
    } catch (firestoreError) {
      console.warn("Message cached locally; cloud sync pending:", firestoreError.message);
    }
  };

  // React to a message
  const handleReaction = async (msgId, reactionKey) => {
    const updated = messages.map((m) => {
      if (m.id === msgId) {
        const reactions = m.reactions || {};
        return {
          ...m,
          reactions: {
            ...reactions,
            [reactionKey]: (reactions[reactionKey] || 0) + 1,
          },
        };
      }
      return m;
    });

    setMessages(updated);
    localStorage.setItem("sahaya_community_chats", JSON.stringify(updated));

    try {
      const docRef = doc(db, "community_messages", msgId);
      await updateDoc(docRef, {
        [`reactions.${reactionKey}`]: increment(1),
      });
    } catch (e) {}
  };

  return (
    <>
      <Nav />
      <div className="community-chat-page">
        <div className="community-chat-container">
          {/* Header */}
          <div className="community-chat-header">
            <div className="community-header-left">
              <div className="community-header-icon">💬</div>
              <div>
                <h1 className="community-header-title">Peer Support Sanctuary</h1>
                <p className="community-header-subtitle">
                  <span className="community-status-dot"></span> Active Community • Kind, safe & non-judgmental
                </p>
              </div>
            </div>

            <div className="community-header-actions">
              <button
                type="button"
                className={`community-mode-btn ${isAnonymous ? "anonymous" : "public"}`}
                onClick={handleTogglePrivacy}
                title="Click to toggle between posting with your name or anonymously"
              >
                {isAnonymous ? "🎭 Posting: Anonymous Seeker" : `👤 Posting as: ${userName}`}
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="community-chat-messages">
            {messages.length === 0 ? (
              <div className="community-empty-notice">
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🌱</div>
                <p>Welcome to the community lounge. Be the first to share an encouraging word today!</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMine = m.userId === (auth.currentUser?.uid || "guest") || m.authorName === userName;
                return (
                  <div
                    key={m.id}
                    className={`community-message-card ${isMine ? "mine" : ""}`}
                  >
                    <div className="community-msg-avatar">
                      {m.isAnonymous ? "🌱" : m.authorName?.charAt(0).toUpperCase() || "S"}
                    </div>
                    <div className="community-msg-bubble">
                      <div className="community-msg-meta">
                        <span className="community-msg-author">{m.authorName}</span>
                        <span className="community-msg-time">{m.time}</span>
                      </div>
                      <div className="community-msg-text">{m.text}</div>
                      <div className="community-msg-reactions">
                        <button
                          type="button"
                          className="community-react-btn"
                          onClick={() => handleReaction(m.id, "heart")}
                          title="Send care"
                        >
                          ❤️ {m.reactions?.heart || 0}
                        </button>
                        <button
                          type="button"
                          className="community-react-btn"
                          onClick={() => handleReaction(m.id, "hug")}
                          title="Send a supportive hug"
                        >
                          🫂 {m.reactions?.hug || 0}
                        </button>
                        <button
                          type="button"
                          className="community-react-btn"
                          onClick={() => handleReaction(m.id, "peace")}
                          title="Send peaceful energy"
                        >
                          🌿 {m.reactions?.peace || 0}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Calming Quick Starters */}
          <div className="community-chat-starters">
            {starterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="community-starter-chip"
                onClick={() => handleSendMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input form */}
          <div className="community-chat-input-area">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="community-input-form"
            >
              <input
                type="text"
                placeholder={isAnonymous ? "Share a kind thought anonymously..." : `Share with the community as ${userName}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="community-input-box"
              />
              <button type="submit" className="community-send-btn">
                Send 🌿
              </button>
            </form>
          </div>
        </div>
      </div>

      <button className="peaceful-back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <Footer />
    </>
  );
};

export default ChatApplication;
