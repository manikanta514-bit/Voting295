// pages/SettingsPage.jsx
import React from "react";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { FaSignOutAlt, FaUser, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../App.css";

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="extra-page">
      <h2>Settings</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3><FaUser /> Account Information</h3>
        <p>Email: <strong>{auth.currentUser?.email}</strong></p>
        {/* You can add more info like name if stored */}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3><FaBell /> Notifications</h3>
        <p>Receive alerts about election updates and announcements.</p>
        {/* Can add toggle switch for notifications if implemented */}
      </div>

      <div>
        <button className="primary-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
