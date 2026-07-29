// About.jsx
import "./About.css";

function About() {
  return (
    <div className="about-wrap">
      {/* Hero */}
      <div className="about-hero">
        <p className="about-eyebrow">Who we are</p>
        <h1 className="about-title">About Mitra</h1>
        <p className="about-lead">
          Mitra was created in 2026 to bring neighborhoods closer together — one
          block at a time. We believe that strong communities start with people
          who know and trust each other.
        </p>
      </div>

      {/* Mission */}
      <div className="about-section">
        <p className="about-section-label">Our mission</p>
        <h2 className="about-section-title">
          Connecting neighbors with local businesses
        </h2>
        <p className="about-body">
          Mitra was created in 2026. Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Temporibus veniam tempora autem necessitatibus est,
          ex rerum ratione sed doloremque dolorum quidem tenetur deleniti esse,
          voluptate magni. Repellat ex laudantium nam!
        </p>
      </div>

      {/* Values */}
      <div className="about-values">
        <div className="about-value">
          <div className="about-value-icon">🤝</div>
          <h3>Trust</h3>
          <p>
            Every business is verified and every resident is real. We build
            communities on accountability.
          </p>
        </div>
        <div className="about-value">
          <div className="about-value-icon">📍</div>
          <h3>Local first</h3>
          <p>
            We prioritize the businesses and people within your block — not
            faceless services from across town.
          </p>
        </div>
        <div className="about-value">
          <div className="about-value-icon">✦</div>
          <h3>Simplicity</h3>
          <p>
            Finding help and booking services should be as easy as knocking on a
            neighbor's door.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
