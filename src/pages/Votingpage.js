// pages/VotingPage.js
import React, { useState, useEffect, useCallback } from "react";
import { db, auth } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  increment,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../App.css";

// React Icons
import {
  FaUniversity,
  FaBuilding,
  FaVoteYea,
  FaUserCheck,
  FaChartBar,
  FaArrowLeft,
  FaPoll,
} from "react-icons/fa";

const VotingPage = () => {
  const [user, setUser] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");
  const [campuses, setCampuses] = useState([]);
  const [selectedVotingType, setSelectedVotingType] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedCandidate, setVotedCandidate] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Track logged in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Load all colleges
  useEffect(() => {
    const fetchColleges = async () => {
      const snapshot = await getDocs(collection(db, "colleges"));
      const list = snapshot.docs.map((doc) => ({
        name: doc.data().name,
        campuses: doc.data().campuses || [],
      }));
      setColleges(list);
    };
    fetchColleges();
  }, []);

  // Load campuses dynamically
  useEffect(() => {
    if (!selectedCollege) return setCampuses([]);
    const docRef = doc(db, "colleges", selectedCollege);
    getDoc(docRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCampuses(data.campuses || []);
        setSelectedCampus(data.campuses[0] || "");
      } else {
        setCampuses([]);
        setSelectedCampus("");
      }
    });
  }, [selectedCollege]);

  // Fetch candidates for selected college/campus and voting type
  const fetchCandidates = useCallback(async () => {
    if (!selectedCollege || !selectedVotingType) return;

    const finalCollege = selectedCampus
      ? `${selectedCollege} - ${selectedCampus}`
      : selectedCollege;

    if (user) {
      const voteDocId = `${user.uid}_${finalCollege}_${selectedVotingType}`;
      const userVoteRef = doc(db, "votes", voteDocId);
      const userVoteSnap = await getDoc(userVoteRef);

      if (userVoteSnap.exists()) {
        const voteData = userVoteSnap.data();
        setHasVoted(true);
        setVotedCandidate(voteData.candidateName || "Unknown Candidate");
        setCandidates([]);
        return;
      }
    }

    const q = query(
      collection(db, "candidates"),
      where("college", "==", finalCollege),
      where("votingType", "==", selectedVotingType)
    );

    const querySnapshot = await getDocs(q);
    const candidateList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setCandidates(candidateList);
    setHasVoted(false);
    setVotedCandidate(null);
  }, [selectedCollege, selectedCampus, selectedVotingType, user]);

  useEffect(() => {
    fetchCandidates();
  }, [selectedCollege, selectedCampus, selectedVotingType, fetchCandidates]);

  // Handle vote
  const handleVote = async (candidateId, candidateName) => {
    if (!user) {
      setMessage("⚠️ You must be logged in to vote.");
      return;
    }

    const finalCollege = selectedCampus
      ? `${selectedCollege} - ${selectedCampus}`
      : selectedCollege;

    try {
      const voteDocId = `${user.uid}_${finalCollege}_${selectedVotingType}`;
      const userVoteRef = doc(db, "votes", voteDocId); 

      const userVoteSnap = await getDoc(userVoteRef);
      if (userVoteSnap.exists()) {
        setMessage("⚠️ You have already voted in this election.");
        return;
      }

      // 🔹 Get voter name from Firestore users collection
      let voterName = "Unknown";
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        voterName = userDocSnap.data().name || "Unknown";
      }

      const candidateRef = doc(db, "candidates", candidateId);
      await updateDoc(candidateRef, { votes: increment(1) });

      await setDoc(userVoteRef, {
        userId: user.uid,
        userName: voterName,         
        candidateId,
        candidateName,
        college: finalCollege,
        votingType: selectedVotingType,
        timestamp: serverTimestamp(),
      });

      setMessage("✅ Vote successfully applied!");
      setHasVoted(true);
      setVotedCandidate(candidateName);
      setCandidates([]);

      navigate("/results");
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div
      className="voting-container"
      style={{
        fontFamily: "'Arial', sans-serif",
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
          color: "#ff6600",
        }}
      >
        <FaVoteYea size={30} />
        <h1>Online Voting Portal</h1>
      </header>

      <section
        style={{
          backgroundColor: "#fff8e1",
          padding: "15px 20px",
          borderRadius: "10px",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.1rem" }}>
          Voting is simple, fair, and helps students learn about proper election
          practices.
        </p>
      </section>

      {/* Dropdowns */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <div className="dropdown-container">
          <FaUniversity style={{ marginRight: "8px", color: "#ff6600" }} />
          <label>College: </label>
          <select
            value={selectedCollege}
            onChange={(e) => {
              setSelectedCollege(e.target.value);
              setSelectedCampus("");
            }}
          >
            <option value="">Select College</option>
            {colleges.map((college) => (
              <option key={college.name} value={college.name}>
                {college.name}
              </option>
            ))}
          </select>
        </div>

        {campuses.length > 0 && (
          <div className="dropdown-container">
            <FaBuilding style={{ marginRight: "8px", color: "#ff6600" }} />
            <label>Campus: </label>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
            >
              {campuses.map((campus) => (
                <option key={campus} value={campus}>
                  {campus}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="dropdown-container">
          <FaPoll style={{ marginRight: "8px", color: "#ff6600" }} />
          <label>Voting Type: </label>
          <select
            value={selectedVotingType}
            onChange={(e) => setSelectedVotingType(e.target.value)}
          >
            <option value="">Select Voting Type</option>
            <option value="CR Election">CR Election</option>
            <option value="Chairman Selection">Chairman Selection</option>
            <option value="Leadership Election">Leadership Election</option>
          </select>
        </div>
      </div>

      <div
        className="candidate-section"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        {message && <p style={{ fontWeight: "bold" }}>{message}</p>}

        {hasVoted ? (
          <div
            className="voted-section"
            style={{
              textAlign: "center",
              padding: "15px",
              borderRadius: "8px",
              backgroundColor: "#e0f7fa",
            }}
          >
            <FaUserCheck size={30} color="#009688" />
            <h2>You have already voted</h2>
            <p>
              You voted for: <b>{votedCandidate}</b>
            </p>
          </div>
        ) : candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="candidate-card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 20px",
                borderRadius: "8px",
                backgroundColor: "#fff3e0",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              <p>
                <b>{candidate.name}</b> — Votes: {candidate.votes}
              </p>
              <button
                className="primary-btn"
                onClick={() => handleVote(candidate.id, candidate.name)}
              >
                <FaVoteYea /> Vote
              </button>
            </div>
          ))
        ) : (
          <p>No candidates available for this selection.</p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <button className="primary-btn" onClick={() => navigate("/results")}>
          <FaChartBar /> View Results
        </button>
        <button className="primary-btn" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default VotingPage;
