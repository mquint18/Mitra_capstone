// components/ReviewModal.jsx
import { useState } from "react";
import "./ReviewModal.css";

export default function ReviewModal({ booking, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const businessName = booking.businessId?.businessName || booking.businessName || "this business";

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    await onSubmit({ bookingId: booking._id, rating, comment });
    setSubmitting(false);
  }

  return (
    <div className="rv-modal-backdrop" onClick={onClose}>
      <div className="rv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rv-modal-header">
          <h3>Review {businessName}</h3>
          <button className="rv-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rv-field">
            <label>How was your experience?</label>
            <div className="rv-star-picker" role="radiogroup" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="rv-star"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  aria-pressed={rating === n}
                >
                  {(hoverRating || rating) >= n ? "★" : "☆"}
                </button>
              ))}
            </div>
          </div>

          <div className="rv-field">
            <label htmlFor="rv-comment">Comment (optional)</label>
            <textarea
              id="rv-comment"
              placeholder="What was your experience like?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <span className="rv-char-count">{comment.length}/500</span>
          </div>

          <div className="rv-modal-actions">
            <button type="button" className="rv-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="rv-btn-submit" disabled={rating === 0 || submitting}>
              {submitting ? "Submitting…" : "Submit review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
