// pages/MainPage.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import "../App.css";

// React Icons
import {
  FaLock,
  FaCheckCircle,
  FaChartBar,
  FaUserPlus,
  FaUser,
  FaVoteYea,
  FaPoll,
  FaSignInAlt,
  FaUserShield,
  FaArrowRight,
  FaInfoCircle,
  FaCog,
  
} from "react-icons/fa";

const highlightStyle = {
  backgroundColor: "#fff3e0",
  padding: "20px",
  borderRadius: "12px",
  width: "220px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  transition: "transform 0.3s, box-shadow 0.3s",
  cursor: "default",
};

const highlightHover = {
  transform: "translateY(-5px)",
  boxShadow: "0 8px 12px rgba(0,0,0,0.2)",
};

function MainPage() {
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const navigate = useNavigate();

  const handleVoteClick = () => navigate("/voting");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          if (userDoc.data().role === "admin") setIsAdmin(true);
        }
      }
    };
    const unsubscribe = auth.onAuthStateChanged(() => fetchUserData());
    return () => unsubscribe();
  }, []);

  return (
    <div className="main-page" style={{ fontFamily: "'Arial', sans-serif" }}>
      <div className="content-page" style={{ padding: "20px", lineHeight: "1.7" }}>
      
        <header
          style={{
            background: "linear-gradient(90deg, #ff6600, #ff6600)",
            padding: "30px 20px 40px",
            textAlign: "center",
            borderRadius: "8px",
            marginTop:"0px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              margin: "0 0 20px 0",
              fontSize: "2rem",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              fontWeight: "bold",
            }}
          >
            <FaVoteYea /> ONLINE VOTING PLATFORM
          </h1>

          <nav
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "25px",
            }}
          >
            <Link
              to="/about"
              style={{
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "0.3s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#ffd54f")}
              onMouseLeave={(e) => (e.target.style.color = "white")}
            >
              <FaInfoCircle /> About
            </Link>
            
            
            {isAdmin && (
              <Link
                to="/setup-candidates"
                style={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "0.3s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ffd54f")}
                onMouseLeave={(e) => (e.target.style.color = "white")}
              >
                <FaUserShield /> Admin
              </Link>
            )}
             
            <Link
              to="/signup"
              style={{
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "0.3s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#ffd54f")}
              onMouseLeave={(e) => (e.target.style.color = "white")}
            >
              <FaUserPlus /> Signup
            </Link>

            <Link
              to="/login"
              style={{
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "0.3s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#ffd54f")}
              onMouseLeave={(e) => (e.target.style.color = "white")}
            >
              <FaSignInAlt /> Login
            </Link>

            <Link
              to="/settings"
              style={{
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "0.3s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#ffd54f")}
              onMouseLeave={(e) => (e.target.style.color = "white")}
            >
              <FaCog /> Settings
            </Link>
          </nav>
        </header>

        {/* ======= WELCOME ======= */}
        <p
          style={{
            fontSize: "1.2rem",
            fontWeight: "500",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaUser /> Hello {userData ? userData.name : "Guest"}, welcome to the Online Voting Platform
        </p>

        {/* ======= VOTING POINTS ======= */}
        <section
          style={{
            backgroundColor: "#fff8e1",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "1.1rem", marginBottom: "20px" }}>
            Voting is simple, ensures fairness, and teaches students responsible participation.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              flexWrap: "wrap",
              marginTop: "20px",
              marginBottom: "30px",
            }}
          >
            {[
              { icon: <FaUser size={30} color="#ff6600" />, text: "Students learn proper election practices" },
              { icon: <FaCheckCircle size={30} color="#ff6600" />, text: "Vote Once Only" },
              { icon: <FaChartBar size={30} color="#ff6600" />, text: "Instant Results" },
              { icon: <FaLock size={30} color="#ff6600" />, text: "Confidential & Trustworthy" },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  ...highlightStyle,
                  ...(hoverIndex === index ? highlightHover : {}),
                }}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {item.icon}
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ======= HOW IT WORKS ======= */}
        <section style={{ marginBottom: "40px" }}>
          <h3 style={{ marginBottom: "20px" }}>How It Works</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div style={{ flex: "1 1 200px" }}>
              <FaUserPlus size={40} color="#ff6600" />
              <h4> Register</h4>
              <p>Create your account to get started</p>
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <FaVoteYea size={40} color="#ff6600" />
              <h4> Vote</h4>
              <p>Select your candidate securely</p>
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <FaPoll size={40} color="#ff6600" />
              <h4> Results</h4>
              <p>View results instantly in real-time</p>
            </div>
          </div>
        </section>

        {/* ======= CALL TO ACTION ======= */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <button className="primary-btn" onClick={handleVoteClick}>
            Proceed to Cast Your Vote <FaArrowRight style={{ marginRight: "8px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
