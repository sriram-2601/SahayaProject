const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Optional Twilio setup if credentials are provided in .env
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
  try {
    const twilio = require("twilio");
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log("Twilio SMS integration active.");
  } catch (err) {
    console.warn("Twilio package not initialized, falling back to simulated SMS:", err.message);
  }
}

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Sahaya Wellness Backend Server",
    timestamp: new Date().toISOString()
  });
});

// Appointment booking SMS dispatch endpoint
app.post("/send-message", async (req, res) => {
  const { phone, appointmentDetails } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, error: "Phone number is required." });
  }

  const messageText = `🌿 Sahaya Appointment Confirmed!
Consultant: ${appointmentDetails?.consultantName || "Specialist"} (${appointmentDetails?.specialization || "Mental Health"})
Date: ${appointmentDetails?.date || "Upcoming"} at ${appointmentDetails?.time || "10:00 AM"}
Mode: ${appointmentDetails?.location || "Online"}
Your sanctuary awaits. Be kind to yourself today.`;

  console.log(`[Appointment Request] Target: ${phone}`);
  console.log(`Message:\n${messageText}`);

  if (twilioClient) {
    try {
      const message = await twilioClient.messages.create({
        body: messageText,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      return res.json({
        success: true,
        message: "Confirmation SMS successfully dispatched via Twilio!",
        sid: message.sid
      });
    } catch (twilioErr) {
      console.error("Twilio SMS failed:", twilioErr.message);
      return res.json({
        success: true,
        simulated: true,
        message: "Appointment confirmed! (Twilio delivery fallback)",
        error: twilioErr.message
      });
    }
  }

  // Simulated delivery when no Twilio credentials are in environment
  return res.json({
    success: true,
    simulated: true,
    message: "Appointment booked and confirmation reminder prepared successfully!",
    details: {
      phone,
      appointmentDetails
    }
  });
});

// Scheduled Reminders endpoint
app.post("/api/reminders", (req, res) => {
  const { phoneNumber, message, time } = req.body;
  console.log(`[Mindful Reminder Scheduled] Phone: ${phoneNumber}, Time: ${time}, Message: "${message}"`);
  res.json({
    success: true,
    message: "Mindful reminder successfully recorded on server."
  });
});

app.listen(PORT, () => {
  console.log(`🌿 Sahaya Backend Server running smoothly on http://localhost:${PORT}`);
});
