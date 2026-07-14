//GetStarted.jsx

import { useNavigate } from "react-router-dom";

function GetStarted() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Get Started With mitra!</h1>
      <button onClick={() => navigate("/sign-up")}>I am a resident</button>
      <button onClick={() => navigate("/business-register")}>
        I am a Business
      </button>
    </div>
  );
}

export default GetStarted;
