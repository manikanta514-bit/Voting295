// pages/SetupCandidates.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import "../App.css";
import {
  FaUserPlus,
  FaUniversity,
  FaUsers,
  FaVoteYea,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaSchool,
} from "react-icons/fa";

const SetupCandidates = () => {
  const [name, setName] = useState("");
  const [colleges, setColleges] = useState([]);
  const [college, setCollege] = useState("");
  const [campuses, setCampuses] = useState([]);
  const [campus, setCampus] = useState("");
  const [votingType, setVotingType] = useState("");
  const [candidatesList, setCandidatesList] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [allUsers, setAllUsers] = useState({});
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [newRole, setNewRole] = useState("");

  // Real-time Colleges
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "colleges"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        name: doc.data().name,
        campuses: doc.data().campuses || [],
      }));
      setColleges(list);
    });
    return () => unsubscribe();
  }, []);

  // Load Campuses Dynamically
  useEffect(() => {
    if (!college) {
      setCampuses([]);
      setCampus("");
      return;
    }
    const selected = colleges.find((c) => c.name === college);
    if (selected) {
      setCampuses(selected.campuses || []);
      setCampus(selected.campuses[0] || "");
    }
  }, [college, colleges]);

  // Real-time Candidates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "candidates"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCandidatesList(list);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Users
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersMap = {};
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        usersMap[docSnap.id] = {
          name: data.name || "Unknown",
          role: data.role || "user",
        };
      });
      setAllUsers(usersMap);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Votes
  useEffect(() => {
    const votesQuery = collection(db, "users");
    const unsubscribe = onSnapshot(votesQuery, (snapshot) => {
      const votesList = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          if (!data.candidateName) return null;
          const userInfo = allUsers[data.userId] || {
            name: "Unknown",
            role: "user",
          };
          return {
            id: docSnap.id,
            userId: data.userId,
            userName: userInfo.name,
            role: userInfo.role,
            candidateName: data.candidateName,
            college: data.college,
            votingType: data.votingType,
            timestamp: data.timestamp,
          };
        })
        .filter((v) => v !== null);
      setUserVotes(votesList);
    });
    return () => unsubscribe();
  }, [allUsers]);

  // Add Candidate
  const handleAddCandidate = async () => {
    if (!name || !college || !votingType) {
      alert("⚠️ Please fill all required fields.");
      return;
    }
    const finalCollege = campus ? `${college} - ${campus}` : college;
    try {
      await addDoc(collection(db, "candidates"), {
        name,
        college: finalCollege,
        votingType,
        votes: 0,
      });
      alert("✅ Candidate added successfully!");
      setName("");
      setCollege("");
      setCampus("");
      setVotingType("");
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  // Add College
  const handleAddCollege = async () => {
    const newCollege = prompt("Enter new college name:");
    if (!newCollege) return;
    const campusesInput = prompt(
      `Enter campuses for "${newCollege}" separated by commas:`
    );
    const campusesArray = campusesInput
      ? campusesInput.split(",").map((c) => c.trim()).filter((c) => c)
      : [];
    try {
      await setDoc(doc(db, "colleges", newCollege), {
        name: newCollege,
        campuses: campusesArray,
      });
      alert(`College "${newCollege}" added successfully!`);
    } catch (error) {
      console.error("Error adding college:", error);
    }
  };

  // Edit Role
  const handleEditRole = (userId, currentRole) => {
    setEditingRoleId(userId);
    setNewRole(currentRole);
  };

  const handleSaveRole = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setEditingRoleId(null);
      setNewRole("");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setNewRole("");
  };

  return (
    <div className="setup-container">
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <FaVoteYea /> Setup Admin & Candidates
        </h2>

        {/* Create College Button */}
        <button
          className="primary-btn"
          style={{ marginBottom: "20px" }}
          onClick={handleAddCollege}
        >
          <FaPlus /> Create College
        </button>

        {/* Candidate Form */}
        <div
          style={{
            marginTop: "20px",
            textAlign: "left",
            maxWidth: "400px",
            margin: "auto",
          }}
        >
          <h4>
            <FaUserPlus /> Candidate Name
          </h4>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <h4 style={{ marginTop: "10px" }}>
            <FaUniversity /> College
          </h4>
          <select
            value={college}
            onChange={(e) => {
              setCollege(e.target.value);
              setCampus("");
            }}
          >
            <option value="">Select College</option>
            {colleges.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {campuses.length > 0 && (
            <>
              <h4 style={{ marginTop: "10px" }}>
                <FaSchool /> Campus
              </h4>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
              >
                {campuses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </>
          )}

          <h4 style={{ marginTop: "10px" }}>
            <FaVoteYea /> Voting Type
          </h4>
          <select
            value={votingType}
            onChange={(e) => setVotingType(e.target.value)}
          >
            <option value="">Select Voting Type</option>
            <option value="CR Election">CR Election</option>
            <option value="Chairman Selection">Chairman Selection</option>
            <option value="Leadership Election">Leadership Election</option>
          </select>

          <button
            className="primary-btn"
            style={{ marginTop: "20px" }}
            onClick={handleAddCandidate}
          >
            <FaPlus /> Add Candidate
          </button>
        </div>

        {/* Candidates Table */}
        <h2 style={{ marginTop: "40px" }}>
          <FaUsers /> Candidates List
        </h2>
        {candidatesList.length === 0 ? (
          <p>No candidates added yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>College</th>
                  <th>Voting Type</th>
                  <th>Votes</th>
                </tr>
              </thead>
              <tbody>
                {candidatesList.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.college}</td>
                    <td>{c.votingType}</td>
                    <td>{c.votes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Votes Table */}
        <h2 style={{ marginTop: "40px" }}>
          <FaUsers /> Users Votes
        </h2>
        {userVotes.length === 0 ? (
          <p>No votes cast yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>User ID</th>
                  <th>Candidate</th>
                  <th>College</th>
                  <th>Voting Type</th>
                  <th>Timestamp</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userVotes.map((vote) => (
                  <tr key={vote.id}>
                    <td>{vote.userName}</td>
                    <td>{vote.userId}</td>
                    <td>{vote.candidateName}</td>
                    <td>{vote.college}</td>
                    <td>{vote.votingType}</td>
                    <td>
                      {vote.timestamp?.toDate
                        ? vote.timestamp.toDate().toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      {editingRoleId === vote.userId ? (
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      ) : (
                        vote.role
                      )}
                    </td>
                    <td>
                      {editingRoleId === vote.userId ? (
                        <>
                          <button onClick={() => handleSaveRole(vote.userId)}>
                            <FaSave />
                          </button>
                          <button onClick={handleCancelEdit}>
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            handleEditRole(vote.userId, vote.role)
                          }
                        >
                          <FaEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupCandidates;
