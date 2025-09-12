// LandingPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaVoteYea, FaUniversity, FaPoll, FaArrowRight } from "react-icons/fa";
import "../App.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="App landing-page">
      {/* Heading */}
      <h1 className="head"><FaVoteYea style={{ marginRight: "8px" }} /> ONLINE VOTING SYSTEM</h1>
      <p className="subhead">
        Vote safely and easily from your campus. Our platform ensures that
        every vote counts and provides real-time transparency for all
        participants.
      </p>

      
      <div className="landing-info">
        <div className="info-card">
          <FaUniversity size={40} color="#ff6600" />
          <p>Easy access to your <b>campus</b> elections</p>
        </div>
        <div className="info-card">
          <FaVoteYea size={40} color="#ff6600" />
          <p>Vote securely and <b>anonymously</b></p>
        </div>
        <div className="info-card">
          <FaPoll size={40} color="#ff6600" />
          <p>View <b>real-time results</b> instantly</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="landing-buttons">
        <button
          className="primary-btn"
          onClick={() => navigate("/main")}
        >
           Get Started <FaArrowRight style={{ marginRight: "8px" }} />
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
