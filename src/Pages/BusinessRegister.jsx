// BusinessRegister.jsx

import { useState } from "react";
import "./BusinessRegister.css";

function BusinessRegister() {
  const [business, setBusiness] = useState({
    businessName: "",
    businessType: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    website: "",
    phone: "",
    email: "",
    description: "",
    keywords: "",
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setBusiness({
      ...business,
      [e.target.name]: e.target.value,
    });
  }
  async function registerBusiness(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5001/api/business/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            businessName: business.businessName,

            businessType: business.businessType,

            address: {
              street: business.street,
              city: business.city,
              state: business.state,
              zip: business.zip,
            },

            website: business.website,

            phone: business.phone,

            email: business.email,

            description: business.description,

            keywords: business.keywords
              .split(",")
              .map((keyword) => keyword.trim()),

            username: business.username,

            password: business.password,
          }),
        },
      );

      const data = await response.json();

      setMessage(data.message);
    } catch (error) {
      console.log(error);

      setMessage("Registration failed");
    }
  }
  return (
    <div className="br-wrap">
      <h1>Business Registration</h1>

      <form onSubmit={registerBusiness}>
        <input
          name="businessName"
          placeholder="Business Name"
          value={business.businessName}
          onChange={handleChange}
        />

        <input
          name="businessType"
          placeholder="Business Type"
          value={business.businessType}
          onChange={handleChange}
        />

        <input
          name="street"
          placeholder="Street Address"
          value={business.street}
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder="City"
          value={business.city}
          onChange={handleChange}
        />

        <input
          name="state"
          placeholder="State"
          value={business.state}
          onChange={handleChange}
        />

        <input
          name="zip"
          placeholder="Zip Code"
          value={business.zip}
          onChange={handleChange}
        />

        <input
          name="website"
          placeholder="Website"
          value={business.website}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={business.phone}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={business.email}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Business Description"
          value={business.description}
          onChange={handleChange}
        />

        <input
          name="keywords"
          placeholder="Keywords (separate by commas)"
          value={business.keywords}
          onChange={handleChange}
        />

        <input
          name="username"
          placeholder="Username"
          value={business.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={business.password}
          onChange={handleChange}
        />

        <button type="submit">Register Business</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default BusinessRegister;
