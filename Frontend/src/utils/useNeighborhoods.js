// utils/useNeighborhoods.js
import { useState, useEffect } from "react";
import { API } from "./api";

export function useNeighborhoods() {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNeighborhoods() {
      try {
        const res = await fetch(`${API}/api/neighborhoods`);
        const data = await res.json();
        if (res.ok) setNeighborhoods(data.neighborhoods || []);
      } catch (_) {
        console.error("Failed to load neighborhoods");
      } finally {
        setLoading(false);
      }
    }
    fetchNeighborhoods();
  }, []);

  return { neighborhoods, loading };
}
