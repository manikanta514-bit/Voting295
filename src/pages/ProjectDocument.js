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

export default ProjectDocument;
