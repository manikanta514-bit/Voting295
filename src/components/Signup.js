import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FaHome, FaUserPlus,FaSignInAlt,FaPen,FaEnvelope, FaLock, } from "react-icons/fa";
import "../App.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        role: "user",
        createdAt: serverTimestamp(),
      });

      navigate("/"); // Redirect to main page
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2><FaUserPlus style={{ marginRight: "6px" }} />Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <h4><FaPen style={{ marginRight: "4px" }} />Name :</h4>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <h4> <FaEnvelope style={{ marginRight: "4px" }} />Email :</h4>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <h4> <FaLock style={{ marginRight: "4px" }} />Password :</h4>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <h4><FaLock style={{ marginRight: "4px" }} /> Confirm Password :</h4>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="primary-btn">
          <FaUserPlus style={{ marginRight: "6px" }} /> Signup
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
        Already have an account? <Link to="/login"><FaSignInAlt style={{ marginRight: "4px" }} />Sign in</Link>
      </p>
    </div>
  );
}

export default Signup;
