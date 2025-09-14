import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrophy, FaHome } from "react-icons/fa";

const WinnerPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { winners = [] } = state || {};

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <h1 style={{ color: "#ff6600", marginBottom: "20px" }}>
        <FaTrophy /> Current Voting Winners
      </h1>

      {winners.length === 0 ? (
        <p>No winner data available.</p>
      ) : (
        winners.map((w, i) => (
          <div
            key={i}
            style={{
              margin: "20px auto",
              maxWidth: "450px",
              background: "#fff8e1",
              border: "2px solid #ff6600",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#ff6600" }}>Voting Type: {w.type}</h2>
            <p style={{ fontSize: "1.2rem" }}>
              🏆 Winner: <b>{w.name}</b> ({w.votes} votes)
            </p>
            <p style={{ color: "#444" }}>College: {w.college}</p>
          </div>
        ))
      )}

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
};

export default WinnerPage;
