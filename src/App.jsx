App.jsx;

import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import About from "./Pages/About";
import GetStarted from "./Pages/GetStarted";
import UserLoginPage from "./Pages/UserLoginPage";

function App() {
  return (
    <>
      <Header />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<UserLoginPage />} />
      </Routes>
    </>
  );
}

export default App;
