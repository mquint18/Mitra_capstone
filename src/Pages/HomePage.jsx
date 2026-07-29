// // HomePage.jsx

// import "./HomePage.css";

// function HomePage() {
//   return (
//     <div className="home-wrap">
//       <h1>Welcome to Mitra - Your Neighborhood, Connected</h1>
//       <h2>How it Works</h2>
//       <p>
//         Mitra is a Lorem ipsum dolor sit amet, consectetur adipisicing elit.
//         Quibusdam, doloribus. Iure, illo. Vel possimus aut, quidem atque aperiam
//         quae sit facere dolorem maiores necessitatibus ducimus. Saepe explicabo
//         doloremque porro quibusdam. Lorem, ipsum dolor sit amet consectetur
//         adipisicing elit. Quidem iusto quod perspiciatis odit natus maxime cum
//         saepe, doloremque, ullam, dolores sint dolorum minima ab doloribus
//         asperiores ipsum reiciendis modi! Consequatur.
//       </p>

//       <img
//         className="welcome-image"
//         src="src/assets/images/town.webp"
//         alt="small town"
//       />

//       <p>
//         Mitra is a Lorem ipsum dolor sit amet, consectetur adipisicing elit.
//         Quibusdam, doloribus. Iure, illo. Vel possimus aut, quidem atque aperiam
//         quae sit facere dolorem maiores necessitatibus ducimus. Saepe explicabo
//         doloremque porro quibusdam. Lorem, ipsum dolor sit amet consectetur
//         adipisicing elit. Quidem iusto quod perspiciatis odit natus maxime cum
//         saepe, doloremque, ullam, dolores sint dolorum minima ab doloribus
//         asperiores ipsum reiciendis modi! Consequatur.
//       </p>
//     </div>
//   );
// }

// export default HomePage;

// HomePage.jsx
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-wrap">
      {/* Hero */}
      <div className="home-hero">
        <div className="home-hero-text">
          <p className="home-eyebrow">Your neighborhood, connected</p>
          <h1 className="home-title">
            Meet your neighbors.
            <br />
            Help each other out.
          </h1>
          <p className="home-lead">
            Mitra brings your block together! Find trusted local businesses,
            book services, and build the kind of neighborhood where everyone
            looks out for each other.
          </p>
          <div className="home-actions">
            <button
              className="home-btn-primary"
              onClick={() => navigate("/sign-up")}
            >
              Join your block
            </button>
            <button
              className="home-btn-outline"
              onClick={() => navigate("/search")}
            >
              Find a business
            </button>
          </div>
        </div>

        <img
          className="home-hero-img"
          src="src/assets/images/town.webp"
          alt="A friendly neighbourhood street"
        />
      </div>

      {/* How it works */}
      <div className="home-section">
        <p className="home-section-label">Simple by design</p>
        <h2 className="home-section-title">How Mitra works</h2>
        <div className="home-steps">
          <div className="home-step">
            <div className="home-step-icon">📍</div>
            <h3>Join your block</h3>
            <p>
              Enter your address to connect with your actual neighbors — not
              strangers across town.
            </p>
          </div>
          <div className="home-step">
            <div className="home-step-icon">🔍</div>
            <h3>Find a business</h3>
            <p>
              Search local services by name, type, or keyword. See real
              availability and book in seconds.
            </p>
          </div>
          <div className="home-step">
            <div className="home-step-icon">✦</div>
            <h3>Ask the AI advisor</h3>
            <p>
              Not sure what you need? Describe the job and our AI will tell you
              what's involved and who to call.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
