// pages/ProjectDocument.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "../App.css";

function ProjectDocument() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", fontFamily: "'Arial', sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#ff6600", marginBottom: "30px" }}>
        Project Document
      </h1>

      {/* Project iframe */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          height: "600px",
          margin: "0 auto",
          border: "2px solid #ff6600",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <iframe
          src="https://manikantavotingapp.netlify.app/"
          title="Project Document"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>

      {/* Informative section */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "20px auto",
          padding: "15px 20px",
          backgroundColor: "#fff8e1",
          borderRadius: "10px",
          lineHeight: "1.6",
          textAlign: "center",
          color: "#333",
        }}
      >
        <h2 style={{ color: "#ff6600", marginBottom: "15px" }}>Website Development Services</h2>
        <p>
          We specialize in creating websites tailored to your specific requirements. 
          Whether it’s a simple portfolio, a business platform, or a full-featured web application, 
          we can develop it according to your needs. Our goal is to deliver responsive, 
          user-friendly, and modern web solutions that help you achieve your online objectives.
        </p>
        <p>
          For inquiries, custom projects, or collaboration, you can reach out to us directly at: 
          <br />
          <b>sivamanikanta514@gmail.com</b>
        </p>
      </div>

      {/* Back button */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
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

export default ProjectDocument;
