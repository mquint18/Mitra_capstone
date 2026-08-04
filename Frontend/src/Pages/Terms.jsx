// Terms.jsx
import "./Terms.css";

function Terms() {
  return (
    <div className="terms-wrap">
      <div className="terms-hero">
        <p className="terms-eyebrow">Legal</p>
        <h1 className="terms-title">Terms of Service</h1>
        <p className="terms-updated">Last updated: August 2026</p>
      </div>

      <div className="terms-section">
        <p className="terms-body">
          Welcome to Mitra. These terms govern your use of the Mitra platform,
          including the resident and business portals and the AI advisor
          feature. By creating an account or using Mitra in any way, you agree
          to these terms.
        </p>
      </div>

      <div className="terms-section">
        <h2 className="terms-section-title">Accounts</h2>
        <p className="terms-body">
          You must provide accurate information when creating a resident or
          business account. You are responsible for keeping your login
          credentials secure and for all activity that happens under your
          account. Businesses are responsible for the accuracy of their listing,
          including keywords, availability, and contact details.
        </p>
      </div>

      <div className="terms-section">
        <h2 className="terms-section-title">Bookings</h2>
        <p className="terms-body">
          Mitra connects residents with local businesses and facilitates booking
          requests. Mitra is not a party to the agreement between a resident and
          a business. We do not guarantee the quality, availability, pricing, or
          outcome of any service booked through the platform. Any dispute about
          a service should be resolved directly between the resident and the
          business.
        </p>
      </div>

      <div className="terms-section">
        <h2 className="terms-section-title">The Ask Mitra feature</h2>
        <p className="terms-body">
          Mitra includes an AI advisor, powered by Claude, that provides
          guidance on household tasks based on the description and expertise
          level you provide. Please read the following carefully before using
          this feature.
        </p>
        <ul className="terms-list">
          <li>
            The AI advisor generates informational guidance only. It is not
            professional advice from a licensed contractor, electrician,
            plumber, or other tradesperson, and it should not be treated as a
            substitute for one.
          </li>
          <li>
            Responses are generated automatically and may be incomplete,
            outdated, or incorrect. The AI does not know the specific conditions
            of your home, property, or local building codes.
          </li>
          <li>
            Any estimate of difficulty, tools, time, or cost is a general
            approximation, not a quote, and actual requirements may differ
            significantly.
          </li>
          <li>
            Do not use the AI advisor for guidance involving electrical work,
            gas lines, structural repairs, or any task with a risk of injury or
            property damage without also consulting a licensed professional.
          </li>
          <li>
            You are solely responsible for any decision you make or action you
            take based on a response from the AI advisor. Mitra is not liable
            for any injury, loss, or damage that results from following AI
            generated guidance.
          </li>
          <li>
            Do not submit sensitive personal information into the AI advisor
            beyond what is necessary to describe the task at hand.
          </li>
        </ul>
      </div>

      <div className="terms-section">
        <h2 className="terms-section-title">Acceptable use</h2>
        <p className="terms-body">
          You agree not to misuse Mitra, including attempting to access another
          user's account, submitting false information, posting fraudulent
          business listings, or using the platform, including the AI advisor, to
          generate or request harmful, illegal, or abusive content.
        </p>
      </div>

      <div className="terms-section">
        <h2 className="terms-section-title">Limitation of liability</h2>
        <p className="terms-body">
          Mitra is provided on an as is basis. To the fullest extent permitted
          by law, Mitra and its creators are not liable for any indirect,
          incidental, or consequential damages arising from your use of the
          platform, including reliance on the AI advisor or the outcome of any
          booking made through the site.
        </p>
      </div>

      <div className="terms-section">
        <h2 className="terms-section-title">Changes to these terms</h2>
        <p className="terms-body">
          We may update these terms from time to time. Continued use of Mitra
          after changes are posted means you accept the updated terms.
        </p>
      </div>

      <div className="terms-section">
        <h2 className="terms-section-title">Contact us</h2>
        <p className="terms-body">
          Questions about these terms can be sent to{" "}
          <a href="mailto:hello@mitra.app" className="terms-link">
            hello@mitra.app
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default Terms;
