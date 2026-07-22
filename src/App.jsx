// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Layout
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import HomePage from "./Pages/HomePage";
import About from "./Pages/About";
import GetStarted from "./Pages/GetStarted";
import SignUp from "./Pages/SignUp";
import AiAsk from "./Pages/AiAsk";
import BusinessRegister from "./Pages/BusinessRegister";
import BusinessSearch from "./Pages/BusinessSearch";

// Auth pages
import ResidentLogin from "./Pages/ResidentLogin";
import BusinessLogin from "./components/BusinessLogin";

// Protected dashboards
import ResidentDashboard from "./Pages/ResidentDashboard";
import BusinessDashboard from "./components/BusinessDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="app">
      <Header />

      <main className="content">
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/ai-ask" element={<AiAsk />} />
          <Route path="/business-register" element={<BusinessRegister />} />
          <Route path="/login" element={<ResidentLogin />} />
          <Route path="/business/login" element={<BusinessLogin />} />

          {/* ── Resident protected ── */}
          <Route
            path="/resident-dashboard"
            element={
              <ProtectedRoute role="resident">
                <ResidentDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Business protected ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="business">
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route
            path="/search"
            element={
              <ProtectedRoute role="resident">
                <BusinessSearch />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
