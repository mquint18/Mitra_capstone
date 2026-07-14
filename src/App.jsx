App.jsx;

import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <>
      <Header></Header>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="ai-ask" element={<AiAsk />} />
        <Route path="/business-register" element={<BusinessRegister />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
