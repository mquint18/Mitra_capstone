// hooks/useBusinessSearch.js
import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:5001/api/search";

export function useBusinessSearch() {
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  // Fetch distinct businessTypes for the category dropdown
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setCategories(data.categories);
      } catch {
        // silently fail — "all" still works
      }
    }
    fetchCategories();
  }, [token]);

  const search = useCallback(
    async ({ q = "", category = "all", pageNum = 1 } = {}) => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (category !== "all") params.set("category", category);
      params.set("page", pageNum);
      params.set("limit", 10);

      try {
        const res = await fetch(`${API}?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Search failed");
          return;
        }

        setResults(data.businesses);
        setTotal(data.total);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  return {
    search,
    results,
    categories,
    loading,
    error,
    total,
    page,
    totalPages,
    setPage,
  };
}
