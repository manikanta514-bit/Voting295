// pages/AboutPage.jsx
import React from "react";
import "../App.css";

const AboutPage = () => {
  return (
    <div className="extra-page">
      <h2>About Our Voting System</h2>
      <p>
        This campus online voting platform allows students to securely log in,
        cast their votes once, and view real-time results through interactive
        graphs. It ensures transparency, quick counting, and an eco-friendly
        paperless process.
      </p>
      <p>
        Developed using <strong>React</strong> and <strong>Firebase</strong>, it
        is designed for scalability and data security while providing an
        intuitive user experience.
      </p>

      <h3>What Information is Provided?</h3>
      <ul>
        <li>Candidate profiles with names, photos, and party/club affiliations.</li>
        <li>Details about voter eligibility and instructions to cast a vote.</li>
        <li>Real-time results and statistics presented in graphs and charts.</li>
        <li>Notifications of election start/end times and important announcements.</li>
      </ul>

      <h3>What is Voting?</h3>
      <p>
        Voting is the process through which eligible members of a community or
        organization express their choices or opinions to select
        representatives, make decisions, or approve policies. In a college
        election, voting allows students to participate in selecting student
        leaders and shaping campus governance.
      </p>

      <h3>Rules and Regulations</h3>
      <ul>
        <li>Only registered students with valid credentials can vote.</li>
        <li>Each student is allowed to cast their vote <strong>once</strong>.</li>
        <li>Voting is confidential and anonymous to ensure fairness.</li>
        <li>Any attempt to manipulate the voting system or impersonate another student is strictly prohibited.</li>
        <li>Results are final and can be viewed in real-time after the election ends.</li>
        <li>All disputes, if any, will be handled by the election committee according to college policy.</li>
      </ul>

      <h3>Our Vision</h3>
      <p>
        We aim to provide a seamless, secure, and efficient online voting
        experience that encourages active student participation and promotes
        transparent decision-making.
      </p>
    </div>
  );
};

export default AboutPage;
