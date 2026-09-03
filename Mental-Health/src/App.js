import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./css/App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import About from "./components/About";
import Chatbot from "./components/Chatbot";
import Consultancy from "./components/Consultancy";
import ContactUs from "./components/ContactUs";
import Feedback from "./components/Feedback";
import { auth } from "./components/Firebase";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import SignUp from "./components/Register";
import Notes from "./components/Notes";
import UserInfoForm from "./components/UserInfoForm";
import Tasks from "./components/TasksDone";
import PersonalAssistant from "./components/PersonalAssistant";
import LandingPage from "./components/LandingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatApplication from "./components/ChatApplication";
import ScribblePad from "./components/ScribblePad";
import NotificationScheduler from './components/NotificationScheduler';
import Model from "./components/Model";
import ConsultancyProfiles from "./components/ConsultancyProfiles";
import BookAppointment from "./components/BookAppointment";

function App() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      // User auth listener
    });
    return () => unsubscribe();
  }, []);

  const basename = window.location.pathname.startsWith("/SahayaProject")
    ? "/SahayaProject"
    : window.location.pathname.startsWith("/SahayA")
    ? "/SahayA"
    : "";

  return (
    <Router basename={basename}>
      <Routes>
        {/* Landing Page at root */}
        <Route path="/" element={<LandingPage />} />

        {/* Core Wellness & Support Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/consultancy" element={<Consultancy />} />
        <Route path="/consultancy-profiles" element={<ConsultancyProfiles />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/scribble-pad" element={<ScribblePad />} />
        <Route path="/tasksDone" element={<Tasks />} />
        <Route path="/personal-assistant" element={<PersonalAssistant />} />
        <Route path="/notification-scheduler" element={<NotificationScheduler />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/UserInfoForm" element={<UserInfoForm />} />
        <Route path="/Model" element={<Model />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/chat-application" element={<ChatApplication />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;