import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./css/App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import About from "./components/About";
import Chatbot from "./components/Chatbot";
import Consultancy from "./components/Consultancy";
import ContactUs from "./components/ContactUs";
import Feedback from "./components/Feedback";
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
import ProtectedRoute from "./components/ProtectedRoute";
import Meditation from "./components/Meditation";

function App() {
  const basename = window.location.pathname.startsWith("/SahayaProject")
    ? "/SahayaProject"
    : window.location.pathname.startsWith("/SahayA")
    ? "/SahayA"
    : "";

  return (
    <Router basename={basename}>
      <Routes>
        {/* Public Routes - Accessible to all visitors */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactUs" element={<ContactUs />} />

        {/* Protected Routes - Requires Authentication */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scribble-pad"
          element={
            <ProtectedRoute>
              <ScribblePad />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasksDone"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserInfoForm"
          element={
            <ProtectedRoute>
              <UserInfoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultancy"
          element={
            <ProtectedRoute>
              <Consultancy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultancy-profiles"
          element={
            <ProtectedRoute>
              <ConsultancyProfiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personal-assistant"
          element={
            <ProtectedRoute>
              <PersonalAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification-scheduler"
          element={
            <ProtectedRoute>
              <NotificationScheduler />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Model"
          element={
            <ProtectedRoute>
              <Model />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat-application"
          element={
            <ProtectedRoute>
              <ChatApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meditation"
          element={
            <ProtectedRoute>
              <Meditation />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;