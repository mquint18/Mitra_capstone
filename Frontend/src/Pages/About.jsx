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
          Mitra was created in 2026 to bring neighborhoods closer together, one
          block at a time. We believe strong communities start with people who
          know and trust each other.
        </p>
      </div>

      {/* Mission */}
      <div className="about-section">
        <p className="about-section-label">Our mission</p>
        <h2 className="about-section-title">
          Connecting neighbors with local businesses
        </h2>
        <p className="about-body">
          Every neighborhood has businesses worth knowing. The landscaper three
          streets over. The cleaner your neighbor swears by. The handyman who
          never overcharges and always shows up on time. The problem was never
          that they didn't exist. It was that finding them meant asking around,
          hoping for a recommendation, or taking a chance on a stranger from
          across town.
        </p>
        <p className="about-body" style={{ marginTop: "12px" }}>
          Mitra was built in 2026 to change that. What started as a simple idea,
          that the people who make a neighborhood feel like home are often the
          hardest to find, grew into a platform that puts trusted local
          businesses right in front of the residents who need them. Today, Mitra
          helps neighbors discover, book, and rely on the services already
          working in their own community, so finding help feels as easy as
          asking the person next door.
        </p>
      </div>

      {/* Values */}
      <div className="about-values">
        <div className="about-value">
          <div className="about-value-icon">🤝</div>
          <h3>Trust</h3>
          <p>
            Every business on Mitra is verified and every resident is a real
            neighbor. Trust is what turns a listing into a relationship.
          </p>
        </div>
        <div className="about-value">
          <div className="about-value-icon">📍</div>
          <h3>Community first</h3>
          <p>
            We start with the people and businesses already on your block, not a
            faceless directory of strangers scattered across town.
          </p>
        </div>
        <div className="about-value">
          <div className="about-value-icon">✦</div>
          <h3>Simplicity</h3>
          <p>
            Finding help should feel as natural as knocking on a neighbor's
            door. We keep it that simple, every time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
