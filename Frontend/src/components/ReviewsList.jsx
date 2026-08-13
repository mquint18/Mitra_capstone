// components/ReviewsList.jsx
import { useState, useEffect } from "react";
import { API } from "../utils/api";
import "./ReviewsList.css";

export function StarRating({ rating }) {
  return (
    <span className="rvl-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}>{n <= rating ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

export function useReviewSummary(businessId) {
  const [summary, setSummary] = useState({ avgRating: 0, count: 0 });

  useEffect(() => {
    if (!businessId) return;
    async function fetchSummary() {
      try {
        const res = await fetch(`${API}/api/reviews/business/${businessId}/summary`);
        const data = await res.json();
        if (res.ok) setSummary(data);
      } catch (_) {
        // fail silently, summary just won't show
      }
    }
    fetchSummary();
  }, [businessId]);

  return summary;
}

export default function ReviewsList({ businessId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;
    async function fetchReviews() {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/reviews/business/${businessId}`);
        const data = await res.json();
        if (res.ok) setReviews(data.reviews || []);
      } catch (_) {
        console.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [businessId]);

  if (loading) return <p className="rvl-loading">Loading reviews…</p>;
  if (reviews.length === 0) return <p className="rvl-empty">No reviews yet.</p>;

  return (
    <div className="rvl-list">
      {reviews.map((r) => (
        <div key={r._id} className="rvl-item">
          <div className="rvl-item-header">
            <span className="rvl-name">
              {r.residentId?.firstName || "Anonymous"} {r.residentId?.lastName?.[0] || ""}.
            </span>
            <StarRating rating={r.rating} />
          </div>
          {r.comment && <p className="rvl-comment">{r.comment}</p>}
          <p className="rvl-date">{new Date(r.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
