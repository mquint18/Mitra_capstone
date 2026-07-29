// ProtectedRoute.jsx
// Wraps any route that requires authentication.
// Checks token validity and role before rendering children.
// Redirects to the correct login page if not authenticated.
//
// Usage:
//   <Route path="/"          element={<ProtectedRoute role="resident"><ResidentDashboard /></ProtectedRoute>} />
//   <Route path="/dashboard" element={<ProtectedRoute role="business"><BusinessDashboard /></ProtectedRoute>} />

import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // 1. No token at all
  if (!token) {
    return redirectToLogin(role, location);
  }

  // 2. Decode + validate token
  let payload;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch {
    clearStorage();
    return redirectToLogin(role, location);
  }

  // 3. Check expiry
  if (payload.exp * 1000 < Date.now()) {
    clearStorage();
    return redirectToLogin(role, location);
  }

  // 4. Check role
  if (role && payload.role !== role) {
    if (payload.role === "business")
      return <Navigate to="/dashboard" replace />;
    if (payload.role === "resident")
      return <Navigate to="/resident-dashboard" replace />;
    if (payload.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  // 5. All good
  return children;
}

function clearStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("resident");
  localStorage.removeItem("business");
}

function redirectToLogin(role, location) {
  const loginPath = role === "business" ? "/business/login" : "/login";
  return (
    <Navigate to={loginPath} state={{ from: location.pathname }} replace />
  );
}
