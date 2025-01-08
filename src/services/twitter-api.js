// src/services/twitter-api.js
const API_BASE_URL = 'http://localhost:3001';

export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    const response = await fetch(`${API_BASE_URL}/api/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // Remove credentials if not using sessions/cookies
      // credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Backend connection failed:', error);
    throw error;
  }
};

export const analyzeTwitterHandle = async (handle) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/twitter/analyze/${handle}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // Remove credentials if not using sessions/cookies
      // credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze Twitter handle');
    }

    return response.json();
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};