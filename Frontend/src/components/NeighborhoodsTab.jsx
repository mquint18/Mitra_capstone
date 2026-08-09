// components/NeighborhoodsTab.jsx
import { useState, useEffect, useCallback } from "react";
import { API, authHeaders } from "../utils/api";

export default function NeighborhoodsTab({ showToast }) {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [confirm, setConfirm] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/neighborhoods`);
      const data = await res.json();
      if (res.ok) setNeighborhoods(data.neighborhoods || []);
    } catch (_) {
      showToast("Failed to load neighborhoods");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function addNeighborhood(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await fetch(`${API}/api/neighborhoods`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setNeighborhoods((prev) =>
          [...prev, data.neighborhood].sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
        );
        setNewName("");
        showToast("Neighborhood added ✓");
      } else {
        showToast(data.message || "Failed to add");
      }
    } catch (_) {
      showToast("Failed to add neighborhood");
    }
  }

  async function renameNeighborhood(id, name) {
    try {
      const res = await fetch(`${API}/api/neighborhoods/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setNeighborhoods((prev) =>
          prev.map((n) => (n._id === id ? { ...n, name } : n)),
        );
        showToast("Updated ✓");
      }
    } catch (_) {
      showToast("Failed to update");
    }
  }

  async function deleteNeighborhood(id) {
    try {
      const res = await fetch(`${API}/api/neighborhoods/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setNeighborhoods((prev) => prev.filter((n) => n._id !== id));
        showToast("Neighborhood deleted");
      }
    } catch (_) {
      showToast("Failed to delete");
    }
    setConfirm(null);
  }

  return (
    <div className="ap-tab-content">
      {confirm && (
        <div className="ap-modal-backdrop" onClick={() => setConfirm(null)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <p className="ap-modal-msg">
              Delete "{confirm.name}"? Businesses and residents using it will
              keep the old value.
            </p>
            <div className="ap-modal-actions">
              <button
                className="ap-btn-outline"
                onClick={() => setConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="ap-btn-danger"
                onClick={() => deleteNeighborhood(confirm.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ap-tab-header">
        <h2 className="ap-tab-title">
          Neighborhoods <span className="ap-count">{neighborhoods.length}</span>
        </h2>
      </div>

      <form onSubmit={addNeighborhood} className="ap-add-form">
        <input
          className="ap-search"
          placeholder="Add a new neighborhood…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Add
        </button>
      </form>

      {loading ? (
        <p className="ap-loading">Loading…</p>
      ) : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {neighborhoods.map((n) => (
                <tr key={n._id}>
                  <td>
                    <input
                      type="text"
                      className="ap-neighborhood-input"
                      defaultValue={n.name}
                      onBlur={(e) => {
                        if (
                          e.target.value.trim() &&
                          e.target.value !== n.name
                        ) {
                          renameNeighborhood(n._id, e.target.value.trim());
                        }
                      }}
                    />
                  </td>
                  <td>
                    <span className="ap-badge ap-badge-green">
                      {n.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="ap-btn-delete"
                      onClick={() => setConfirm({ id: n._id, name: n.name })}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {neighborhoods.length === 0 && (
                <tr>
                  <td colSpan={3} className="ap-empty">
                    No neighborhoods yet. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
