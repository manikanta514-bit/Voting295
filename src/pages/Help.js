// pages/Help.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaQuestionCircle, FaHome, FaUserPlus, FaVoteYea, FaPoll, FaUsers, FaCog, FaEnvelope, FaPhone } from "react-icons/fa";
import "../App.css";

function Help() {
  const navigate = useNavigate();

  const helpTopics = [
    {
      title: "Registering an Account",
      icon: <FaUserPlus color="#ff6600" size={30} />,
      description: "Create an account using your email. Provide accurate details to participate in voting.",
    },
    {
      title: "Casting Your Vote",
      icon: <FaVoteYea color="#ff6600" size={30} />,
      description: "After logging in, navigate to the voting section. Select your preferred candidate and submit your vote. Each user can vote only once per voting type.",
    },
    {
      title: "Viewing Results",
      icon: <FaPoll color="#ff6600" size={30} />,
      description: "Results are updated in real-time. Navigate to the Results page to view bar charts per college and voting type.",
    },
    {
      title: "Managing Your Account",
      icon: <FaCog color="#ff6600" size={30} />,
      description: "Update your account information or change your password in the Settings page. Keep your account secure.",
    },
    {
      title: "Troubleshooting",
      icon: <FaQuestionCircle color="#ff6600" size={30} />,
      description: "If you face any issues while voting or viewing results, check your internet connection, login status, and ensure your account is verified.",
    },
  ];

  return (
    <div className="help-container" style={{ padding: "20px", fontFamily: "'Arial', sans-serif" }}>
      {/* Page Header */}
      <h1
        style={{
          textAlign: "center",
          color: "#ff6600",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "40px",
        }}
      >
        <FaQuestionCircle /> Help & Support
      </h1>

      {/* Help Topics */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "30px",
          marginBottom: "50px",
        }}
      >
        {helpTopics.map((topic, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#fff8e1",
              border: "2px solid #ff6600",
              borderRadius: "12px",
              padding: "20px",
              width: "300px",
              minHeight: "180px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 12px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
          >
            {topic.icon}
            <h3 style={{ margin: "10px 0" }}>{topic.title}</h3>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>{topic.description}</p>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div
        style={{
          marginTop: "50px",
          backgroundColor: "#fff8e1",
          border: "2px solid #ff6600",
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          lineHeight: "1.7",
        }}
      >
        <h2
          style={{
            color: "#ff6600",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaEnvelope /> Contact Support
        </h2>

        <p style={{ fontSize: "1rem", marginBottom: "20px", textAlign: "center" }}>
          For any queries, issues, or project requirements, please contact:
        </p>

        <ul style={{ listStyle: "none", padding: 0, fontSize: "1rem", gap: "15px", display: "flex", flexDirection: "column" }}>
          <li>
            <FaEnvelope style={{ color: "#ff6600", marginRight: "8px" }} />
            Email: <b>sivamanikanta514@gmail.com</b>
          </li>
          <li>
            <FaPhone style={{ color: "#ff6600", marginRight: "8px" }} />
            Phone: <b>+91 9154941227</b>
          </li>
          <li>
            <FaUsers style={{ color: "#ff6600", marginRight: "8px" }} />
            Name: <b>Manikanta Veduruparthi</b>
          </li>
        </ul>

        <p style={{ marginTop: "20px" }}>
          If you have any projects or collaboration requirements, please contact via email with detailed information. We will respond professionally and promptly.
        </p>
      </div>
         <div style={{ marginTop: "10px" }}>
                <button
                  className="primary-btn"
                  onClick={() => navigate("/main")}
                >
                  <FaHome style={{ marginRight: "6px" }} /> Back to Home
                </button>
              </div>
    </div>
  );
}

export default Help;
