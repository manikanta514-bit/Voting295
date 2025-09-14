import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {collection,addDoc,doc,onSnapshot,setDoc,updateDoc,deleteDoc,} from "firebase/firestore";
import "../App.css";
import {FaUserPlus,FaUniversity,FaUsers,FaVoteYea,FaEdit,FaSave,FaTimes,FaPlus,FaSchool,FaTrash,} from "react-icons/fa";

const SetupCandidates = () => {
  const [name, setName] = useState("");
  const [colleges, setColleges] = useState([]);
  const [college, setCollege] = useState("");
  const [campuses, setCampuses] = useState([]);
  const [campus, setCampus] = useState("");
  const [votingType, setVotingType] = useState("");
  const [candidatesList, setCandidatesList] = useState([]);
  const [usersList, setUsersList] = useState([]);  
  const [userVotes, setUserVotes] = useState([]);   
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [newRole, setNewRole] = useState("");

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;
    await deleteDoc(doc(db, "candidates", id));
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteDoc(doc(db, "users", id));
  };

  const handleDeleteUserVote = async (id) => {
    if (!window.confirm("Delete this vote?")) return;
    await deleteDoc(doc(db, "votes", id)); // 🔹 DELETE from votes collection
  };


  useEffect(() => {
    const unsub = onSnapshot(collection(db, "colleges"), (snap) => {
      setColleges(
        snap.docs.map((d) => ({
          name: d.data().name,
          campuses: d.data().campuses || [],
        }))
      );
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!college) {
      setCampuses([]);
      setCampus("");
      return;
    }
    const sel = colleges.find((c) => c.name === college);
    if (sel) {
      setCampuses(sel.campuses || []);
      setCampus(sel.campuses[0] || "");
    }
  }, [college, colleges]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "candidates"), (snap) => {
      setCandidatesList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);


  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsersList(all);
    });
    return () => unsub();
  }, []);

  
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "votes"), (snap) => {
      const votes = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setUserVotes(votes);
    });
    return () => unsub();
  }, []);


  const handleAddCandidate = async () => {
    if (!name || !college || !votingType) {
      alert("Please fill all fields");
      return;
    }
    const finalCollege = campus ? `${college} - ${campus}` : college;
    await addDoc(collection(db, "candidates"), {
      name,
      college: finalCollege,
      votingType,
      votes: 0,
    });
    setName("");
    setCollege("");
    setCampus("");
    setVotingType("");
  };

  const handleAddCollege = async () => {
    const newCollege = prompt("Enter new college name:");
    if (!newCollege) return;
    const campusesInput = prompt(
      `Enter campuses for "${newCollege}" separated by commas:`
    );
    const campusesArray = campusesInput
      ? campusesInput.split(",").map((c) => c.trim()).filter((c) => c)
      : [];
    await setDoc(doc(db, "colleges", newCollege), {
      name: newCollege,
      campuses: campusesArray,
    });
  };


  const handleEditRole = (userId, currentRole) => {
    setEditingRoleId(userId);
    setNewRole(currentRole);
  };
  const handleSaveRole = async (userId) => {
    await updateDoc(doc(db, "users", userId), { role: newRole });
    setEditingRoleId(null);
    setNewRole("");
  };
  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setNewRole("");
  };

  return (
    <div className="setup-container">
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <h2 style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <FaVoteYea /> Setup Admin & Candidates
        </h2>

        <button
          className="primary-btn"
          style={{ marginBottom: 20 }}
          onClick={handleAddCollege}
        >
          <FaPlus /> Create College
        </button>

     
        <div style={{ maxWidth: 400, margin: "20px auto", textAlign: "left" }}>
          <h4>
            <FaUserPlus /> Candidate Name
          </h4>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <h4 style={{ marginTop: 10 }}>
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
              <h4 style={{ marginTop: 10 }}>
                <FaSchool /> Campus
              </h4>
              <select value={campus} onChange={(e) => setCampus(e.target.value)}>
                {campuses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </>
          )}

          <h4 style={{ marginTop: 10 }}>
            <FaVoteYea /> Voting Type
          </h4>
          <select value={votingType} onChange={(e) => setVotingType(e.target.value)}>
            <option value="">Select Voting Type</option>
            <option value="CR Election">CR Election</option>
            <option value="Chairman Selection">Chairman Selection</option>
            <option value="Leadership Election">Leadership Election</option>
          </select>

          <button
            className="primary-btn"
            style={{ marginTop: 20 }}
            onClick={handleAddCandidate}
          >
            <FaPlus /> Add Candidate
          </button>
        </div>

        <h2 style={{ marginTop: 40 }}>
          <FaUsers /> Candidates List
        </h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>College</th>
                <th>Voting Type</th>
                <th>Votes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {candidatesList.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.college}</td>
                  <td>{c.votingType}</td>
                  <td>{c.votes}</td>
                  <td>
                    <button
                      className="primary-btn"
                      style={{ backgroundColor: "red" }}
                      onClick={() => handleDeleteCandidate(c.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{ marginTop: 40 }}>
          <FaUsers /> Users
        </h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email / ID</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id}>
                  <td>{u.name || "Unknown"}</td>
                  <td>{u.userId || u.id}</td>
                  <td>
                    {editingRoleId === u.id ? (
                      <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      u.role || "user"
                    )}
                  </td>
                  <td>
                    {editingRoleId === u.id ? (
                      <>
                        <button onClick={() => handleSaveRole(u.id)}>
                          <FaSave />
                        </button>
                        <button onClick={handleCancelEdit}>
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditRole(u.id, u.role || "user")}>
                          <FaEdit />
                        </button>
                        <button
                          className="primary-btn"
                          style={{ backgroundColor: "red", marginLeft: 8 }}
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
        <h2 style={{ marginTop: 40 }}>
          <FaUsers /> User Votes
        </h2>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userVotes.map((v) => (
                <tr key={v.id}>
                  <td>{v.userName || "Unknown"}</td>
                  <td>{v.userId}</td>
                  <td>{v.candidateName}</td>
                  <td>{v.college}</td>
                  <td>{v.votingType}</td>
                  <td>
                    {v.timestamp?.toDate
                      ? v.timestamp.toDate().toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="primary-btn"
                      style={{ backgroundColor: "red" }}
                      onClick={() => handleDeleteUserVote(v.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SetupCandidates;
