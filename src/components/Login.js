import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FaHome, FaSignInAlt,FaUserPlus,FaEnvelope, FaLock } from "react-icons/fa";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Ensure old users have "voted_CR Election" field
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (!userData["voted_CR Election"]) {
          await updateDoc(userRef, {
            "voted_CR Election": {
              candidate: "",
              voted: false,
            },
          });
        }
      }

      navigate("/"); // Redirect to main page
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2><FaSignInAlt style={{ marginRight: "6px" }} /> Sign In</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <h4>  <FaEnvelope style={{ marginRight: "4px" }} />Email</h4>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <h4> <FaLock style={{ marginRight: "4px" }} /> Password</h4>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="primary-btn">
          <FaSignInAlt style={{ marginRight: "6px" }} /> Sign In
        </button>
      </form>

      <div style={{ marginTop: "10px" }}>
        <button
          className="primary-btn"
          onClick={() => navigate("/")}
        >
          <FaHome style={{ marginRight: "6px" }} /> Back to Home
        </button>
      </div>

      <p>
        Don't have an account? <Link to="/signup"><FaUserPlus style={{ marginRight: "4px" }} />Signup</Link>
      </p>
    </div>
  );
}

export default Login;
