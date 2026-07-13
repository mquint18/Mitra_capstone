//GetStarted.jsx

import { useNavigate } from "react-router-dom";
import AiQuery from "../components/AiQuery";

function GetStarted() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Get Started With mitra!</h1>
      <button onClick={() => navigate("/sign-up")}>I am a resident</button>

      <AiQuery></AiQuery>
    </div>
  );
}

export default GetStarted;
