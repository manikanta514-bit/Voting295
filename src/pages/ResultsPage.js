import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../App.css";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

import { FaPoll, FaUniversity, FaUsers, FaHome, FaTrophy } from "react-icons/fa";


const BAR_COLORS = ["#facc15", "#22c55e"];

const ResultsPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [votingTypes, setVotingTypes] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const safeVotes = (value) => (typeof value === "number" ? value : 0);

  
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        const unsubscribeSnapshot = onSnapshot(
          collection(db, "candidates"),
          (snapshot) => {
            const data = snapshot.docs.map((doc) => {
              const d = doc.data();
              return {
                id: doc.id,
                name: d.name || "Unknown",
                votes: safeVotes(Number(d.votes)),
                college: d.college || "Unknown College",
                votingType: d.votingType || "Unknown Type",
              };
            });
            setCandidates(data);
          },
          (error) => console.error("Error fetching candidates:", error)
        );
        return () => unsubscribeSnapshot();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  
  useEffect(() => {
    const uniqueColleges = [
      ...new Set(candidates.map((c) => c.college.split(" - ")[0])),
    ];
    const uniqueVotingTypes = [...new Set(candidates.map((c) => c.votingType))];
    setColleges(uniqueColleges);
    setVotingTypes(uniqueVotingTypes);
  }, [candidates]);

  const getCandidatesByCollegeCampus = (college, typeCandidates) => {
    const filtered = typeCandidates.filter((c) => c.college.startsWith(college));
    const campuses = [...new Set(filtered.map((c) => c.college))];
    return campuses.map((campus) => ({
      campusName: campus,
      candidates: filtered.filter((c) => c.college === campus),
    }));
  };


  const showWinners = () => {
    const winnersByType = votingTypes
      .map((type) => {
        const typeCandidates = candidates.filter((c) => c.votingType === type);
        if (typeCandidates.length === 0) return null;
        const top = typeCandidates.reduce((max, c) =>
          c.votes > max.votes ? c : max
        );
        return {
          type,
          name: top.name,
          votes: top.votes,
          college: top.college,
        };
      })
      .filter(Boolean);

    navigate("/winners", { state: { winners: winnersByType } });
  };

  if (!user) {
    return (
      <div className="flex-center" style={{ fontFamily: "'Arial', sans-serif" }}>
        <p className="results-login-text">Please login to view voting results.</p>
      </div>
    );
  }

  return (
    <div
      className="results-container"
      style={{ padding: "20px", fontFamily: "'Arial', sans-serif" }}
    >
    
      <h1
        style={{
          textAlign: "center",
          color: "#ff6600",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <FaPoll /> Voting Results
      </h1>

   
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <SummaryCard icon={<FaUniversity size={30} color="#ff6600" />} text={`Total Colleges: ${colleges.length}`} />
        <SummaryCard icon={<FaPoll size={30} color="#ff6600" />} text={`Total Voting Types: ${votingTypes.length}`} />
        <SummaryCard icon={<FaUsers size={30} color="#ff6600" />} text={`Total Candidates: ${candidates.length}`} />
      </div>

      
      {votingTypes.map((type) => {
        const typeCandidates = candidates.filter((c) => c.votingType === type);
        return (
          <div key={type} style={{ marginBottom: "60px" }}>
            <h2
              style={{
                color: "#ff6600",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <FaPoll /> Voting Type: {type}
            </h2>

            {colleges.map((college) => {
              const collegeData = getCandidatesByCollegeCampus(
                college,
                typeCandidates
              );

              return collegeData.map((campusData) => {
                const chartData = campusData.candidates.map((c) => ({
                  name: c.name,
                  votes: c.votes,
                }));

                return (
                  <div
                    key={`${type}-${campusData.campusName}`}
                    style={{
                      border: "2px solid #ff6600",
                      borderRadius: "12px",
                      padding: "24px",
                      marginBottom: "30px",
                      width: "100%",
                      maxWidth: "125%",
                      background: "#fff",
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    <h3
                      style={{
                        marginBottom: "20px",
                        color: "#ff6600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <FaUniversity /> {campusData.campusName}
                    </h3>

                    {chartData.length === 0 ? (
                      <p>No candidates for this campus.</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={400} minWidth={300}>
                        <BarChart
                          data={chartData}
                          margin={{ top: 20, right: 20, left: 20, bottom: 50 }}
                          barCategoryGap="20%"
                        >
                          <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            interval={0}
                            angle={-20}
                            textAnchor="end"
                          />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="votes" barSize={50}>
                            <LabelList dataKey="votes" position="top" />
                            {chartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={BAR_COLORS[index % BAR_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                );
              });
            })}
          </div>
        );
      })}

    
      <div className="center-button">
        <button
          className="primary-btn"
          onClick={showWinners}
          style={{
           
            background: "#22c55e",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaTrophy /> Show Winners
        </button>

        <button
          className="primary-btn"
          onClick={() => navigate("/")}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
        >
          <FaHome /> Back to Home
        </button>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, text }) => (
  <div
    className="summary-card"
    style={{
      background: "#fff8e1",
      border: "2px solid #ff6600",
      borderRadius: "12px",
      padding: "20px",
      width: "220px",
      textAlign: "center",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    }}
  >
    {icon}
    <p><b>{text}</b></p>
  </div>
);

export default ResultsPage;
