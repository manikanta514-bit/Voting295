import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import VotingPage from "./pages/Votingpage";
import MainPage from "./pages/Mainpage";
import SetupCandidates from "./pages/SetupCandidates";
import ResultsPage from "./pages/ResultsPage";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";
import Help from "./pages/Help";
import ProjectDocument from "./pages/ProjectDocument";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/voting" element={<VotingPage />} />
      <Route path="/setup-candidates" element={<SetupCandidates />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/help" element={<Help />} />
      <Route path="/project-document" element={<ProjectDocument />} />


    </Routes>
  );
}
export default App;