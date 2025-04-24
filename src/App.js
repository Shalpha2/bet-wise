import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import MicrobeList from "./components/MicrobeList";
import MicrobeProfile from "./components/MicrobeProfile";
import AdminDashboard from "./components/AdminDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/microbes" element={<MicrobeList />} />
            <Route path="/microbe/:id" element={<MicrobeProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <footer className="footer bg-dark text-white py-3">
          <div className="container text-center">
            <p className="mb-0">© 2025 MicrobeDB - All rights reserved</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

