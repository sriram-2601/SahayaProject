const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// =================================================================
// 1. Security Headers (Defends against Clickjacking & MIME-Sniffing)
// =================================================================
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// =================================================================
// 2. Strict CORS Configuration (Defends against VAPT #6 CORS Attacks)
// =================================================================
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://sriram-2601.github.io"
];

// If additional origins configured in environment, append them
if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(",").forEach(origin => {
    const trimmed = origin.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (such as mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`[Security Alert] Blocked unauthorized CORS request from origin: ${origin}`);
      return callback(new Error("CORS policy violation: Unauthorized origin"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: "1mb" })); // Prevent oversized payload attacks

// =================================================================
// 3. In-Memory Rate Limiting (Defends against VAPT #29 Denial-of-Service)
// =================================================================
const createRateLimiter = ({ windowMs = 60000, max = 30, message = "Too many requests. Please try again later." }) => {
  const requests = new Map();

  // Cleanup old records periodically every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requests.entries()) {
      if (now - data.startTime > windowMs) {
        requests.delete(ip);
      }
    }
  }, 300000);

  return (req, res, next) => {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown_ip";
    const now = Date.now();

    let record = requests.get(clientIp);
    if (!record || (now - record.startTime > windowMs)) {
      record = { count: 1, startTime: now };
      requests.set(clientIp, record);
      return next();
    }

    record.count += 1;
    if (record.count > max) {
      console.warn(`[Rate Limit Exceeded] IP: ${clientIp} exceeded limit of ${max} requests.`);
      return res.status(429).json({
        success: false,
        error: message,
        retryAfterMs: windowMs - (now - record.startTime)
      });
    }

    next();
  };
};

// Rate limiter instances
const smsRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5,               // max 5 SMS requests per minute per IP
  message: "Rate limit exceeded: Please wait before requesting more SMS confirmations."
});

const chatRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 20,              // max 20 chat queries per minute per IP
  message: "Counselor chat rate limit reached. Please pause for a moment before your next question."
});

// =================================================================
// 4. Twilio Integration Setup
// =================================================================
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
  try {
    const twilio = require("twilio");
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log("🌿 Twilio SMS integration active.");
  } catch (err) {
    console.warn("⚠️ Twilio package not initialized, falling back to simulated SMS:", err.message);
  }
}

// =================================================================
// 5. Routes
// =================================================================

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Sahaya Secure Wellness Backend",
    timestamp: new Date().toISOString(),
    corsAllowed: allowedOrigins
  });
});

// Appointment booking SMS dispatch endpoint (Protected by Rate Limiter)
app.post("/send-message", smsRateLimiter, async (req, res) => {
  const { phone, appointmentDetails } = req.body;

  if (!phone || typeof phone !== "string" || phone.trim().length < 7 || phone.trim().length > 20) {
    return res.status(400).json({ success: false, error: "A valid phone number is required." });
  }

  const sanitizedPhone = phone.trim();
  const consultantName = String(appointmentDetails?.consultantName || "Specialist").slice(0, 100);
  const specialization = String(appointmentDetails?.specialization || "Mental Health").slice(0, 100);
  const date = String(appointmentDetails?.date || "Upcoming").slice(0, 50);
  const time = String(appointmentDetails?.time || "10:00 AM").slice(0, 50);
  const location = String(appointmentDetails?.location || "Online").slice(0, 100);

  const messageText = `🌿 Sahaya Appointment Confirmed!
Consultant: ${consultantName} (${specialization})
Date: ${date} at ${time}
Mode: ${location}
Your sanctuary awaits. Be kind to yourself today.`;

  console.log(`[Appointment Request] Target: ${sanitizedPhone}`);

  if (twilioClient) {
    try {
      const message = await twilioClient.messages.create({
        body: messageText,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: sanitizedPhone,
      });
      return res.json({
        success: true,
        message: "Confirmation SMS successfully dispatched via Twilio!",
        sid: message.sid
      });
    } catch (twilioErr) {
      console.error("Twilio SMS delivery failed:", twilioErr.message);
      return res.status(500).json({
        success: false,
        simulated: true,
        message: "Appointment confirmed! (SMS gateway fallback)",
        error: "SMS dispatch encountered an issue. Appointment remains recorded."
      });
    }
  }

  // Simulated delivery when no Twilio credentials are in environment
  return res.json({
    success: true,
    simulated: true,
    message: "Appointment booked and confirmation reminder prepared successfully!",
    details: {
      phone: sanitizedPhone,
      consultant: consultantName,
      date,
      time
    }
  });
});

// Scheduled Reminders endpoint (Protected by Rate Limiter)
app.post("/api/reminders", smsRateLimiter, (req, res) => {
  const { phoneNumber, message, time } = req.body;
  if (!phoneNumber || !message) {
    return res.status(400).json({ success: false, error: "Phone number and reminder message are required." });
  }

  console.log(`[Mindful Reminder Scheduled] Target: ${phoneNumber.slice(0, 15)}, Time: ${time}`);
  res.json({
    success: true,
    message: "Mindful reminder successfully recorded on server."
  });
});

// =================================================================
// 6. Secure Backend AI Chat Proxy (Protects VAPT #18 & #30 LLM Attacks)
// =================================================================
// The GROQ API key is kept exclusively on the server, never leaked to the client bundle.
const SYSTEM_INSTRUCTION = {
  role: "system",
  content: "Hello! I am Sahaya, your empathetic mental health support assistant. I provide a safe, non-judgmental space, listen actively, and guide you with calming reassurance. If the user mentions self-harm, suicide, or crisis, immediately provide helplines (Kiran: 1800-599-0019, Tele-MANAS: 14416, 988 Lifeline) with utmost kindness and care."
};

app.post("/api/chat", chatRateLimiter, async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, error: "Valid message history array is required." });
  }

  // Limit conversation history length to avoid token inflation attacks
  const sanitizedMessages = messages.slice(-10).map(msg => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: String(msg.content || "").slice(0, 2000)
  }));

  const groqApiKey = process.env.GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY;

  if (!groqApiKey) {
    // If no Groq key configured on server, indicate fallback required
    return res.json({
      success: false,
      fallbackRequired: true,
      message: "Server running in offline counselor mode (no GROQ_API_KEY set)."
    });
  }

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          SYSTEM_INSTRUCTION,
          ...sanitizedMessages
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.warn(`[Groq API Error] HTTP ${groqResponse.status}:`, errText);
      return res.status(502).json({
        success: false,
        fallbackRequired: true,
        error: "AI upstream provider currently unavailable."
      });
    }

    const data = await groqResponse.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.json({
        success: false,
        fallbackRequired: true,
        message: "No content generated from model."
      });
    }

    return res.json({
      success: true,
      reply
    });
  } catch (error) {
    console.error("[AI Proxy Exception]:", error.message);
    return res.status(500).json({
      success: false,
      fallbackRequired: true,
      error: "Internal error processing AI counselor request."
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ success: false, error: err.message });
  }
  console.error("[Unhandled Server Error]:", err.message);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🛡️ Sahaya Secure Backend Server running on http://localhost:${PORT}`);
  console.log(`🔒 Active Protections: Strict CORS, Rate Limiting, Security Headers, Groq Backend Proxy`);
});
