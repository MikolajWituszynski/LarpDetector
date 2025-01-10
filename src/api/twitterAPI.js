// src/api/twitter.js
const API_BASE = 'http://localhost:3001/api';

export const analyzeTwitterHandle = async (handle) => {
  const response = await fetch(`${API_BASE}/twitter/analyze/${handle}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};