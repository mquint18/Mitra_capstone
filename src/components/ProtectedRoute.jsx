// components/ProtectedRoute.jsx
// Wraps any route that requires a logged-in business user.
// Usage: <Route path="/dashboard" element={<ProtectedRoute><BusinessDashboard /></ProtectedRoute>} />

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role = "business" }) {
  const token    = localStorage.getItem("token");
  const raw      = localStorage.getItem("business");

  // No token at all → send to login
  if (!token || !raw) {
    return <Navigate to="/business/login" replace />;
  }

  try {
    // Decode payload (no verify — server verifies on every API call)
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Expired?
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("business");
      return <Navigate to="/business/login" replace />;
    }

    // Wrong role?
    if (role && payload.role !== role) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch {
    return <Navigate to="/business/login" replace />;
  }
}
