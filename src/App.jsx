//App.jsx;

import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import About from "./Pages/About";
import GetStarted from "./Pages/GetStarted";
import UserLoginPage from "./Pages/UserLoginPage";
import Footer from "./components/Footer";
import SignUp from "./Pages/SignUp";
import AiAsk from "./Pages/AiAsk";
import BusinessRegister from "./Pages/BusinessRegister";
import BusinessLogin from "./components/BusinessLogin";
import BusinessDashboard from "./components/BusinessDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ResidentLogin from "./pages/ResidentLogin";

function App() {
  return (
    <>
      <div className="app">
        <Header></Header>
        <Navbar></Navbar>
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/login" element={<UserLoginPage />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="ai-ask" element={<AiAsk />} />
            <Route path="/business-register" element={<BusinessRegister />} />
            <Route path="/business/login" element={<BusinessLogin />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="business">
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<ResidentLogin />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
