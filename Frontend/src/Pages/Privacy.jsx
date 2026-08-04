// Privacy.jsx
import "./Privacy.css";

function Privacy() {
  return (
    <div className="privacy-wrap">
      <div className="privacy-hero">
        <p className="privacy-eyebrow">Legal</p>
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-updated">Last updated: August 2026</p>
      </div>

      <div className="privacy-section">
        <p className="privacy-body">
          Mitra helps residents find and book trusted local businesses. This
          policy explains what information we collect, how we use it, and the
          choices you have. By using Mitra, you agree to the practices described
          here.
        </p>
      </div>

      <div className="privacy-section">
        <h2 className="privacy-section-title">Information we collect</h2>
        <p className="privacy-body">
          When you create a resident or business account, we collect the
          information you provide directly, such as your name, email address,
          phone number, address, and password. Business accounts also include
          business name, category, description, and keywords used for search.
        </p>
        <p className="privacy-body" style={{ marginTop: "10px" }}>
          When you use Mitra to search for or book a service, we collect details
          about that activity, including the businesses you search for, the
          bookings you request, and the messages exchanged through the platform.
        </p>
      </div>

      <div className="privacy-section">
        <h2 className="privacy-section-title">How we use your information</h2>
        <ul className="privacy-list">
          <li>To create and manage your account</li>
          <li>
            To connect residents with local businesses and process bookings
          </li>
          <li>
            To power the AI advisor feature, which uses the details you provide
            about a task to generate guidance
          </li>
          <li>
            To communicate with you about your account, bookings, or updates to
            Mitra
          </li>
          <li>
            To keep the platform safe, including preventing fraud and abuse
          </li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2 className="privacy-section-title">
          How we protect your information
        </h2>
        <p className="privacy-body">
          Passwords are hashed and never stored in plain text. Access to your
          account requires a signed authentication token. We limit who can view
          your personal information based on your account type, so residents and
          businesses only see what is necessary to complete a booking.
        </p>
      </div>

      <div className="privacy-section">
        <h2 className="privacy-section-title">Sharing your information</h2>
        <p className="privacy-body">
          We do not sell your personal information. When you request a booking,
          the business you contact can see the details needed to fulfill that
          request, such as your name, contact information, and the note you
          provide. We may share information if required by law or to protect the
          safety of our users.
        </p>
      </div>

      <div className="privacy-section">
        <h2 className="privacy-section-title">Your choices</h2>
        <p className="privacy-body">
          You can update your profile information at any time from your
          dashboard. You may request that your account and associated data be
          deleted by contacting us using the information below.
        </p>
      </div>

      <div className="privacy-section">
        <h2 className="privacy-section-title">Contact us</h2>
        <p className="privacy-body">
          If you have questions about this policy or how your information is
          handled, reach out at{" "}
          <a href="mailto:hello@mitra.app" className="privacy-link">
            hello@mitra.app
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default Privacy;
