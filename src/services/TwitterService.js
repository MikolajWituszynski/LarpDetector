// src/services/twitter.js

export class TwitterService {
    constructor() {
      // Exactly match the backend configuration
      this.API_BASE = 'https://toto.oz.xyz/api/metadata';
      this.headers = {
        'accept': 'application/json',
        'x-api-key': process.env.REACT_APP_TOTO_API_KEY,
        'Content-Type': 'application/json'
      };
    }
  
    async makeRequest(endpoint, user) {
      try {
        // Exactly match how backend made the request
        const response = await fetch(`${this.API_BASE}/${endpoint}`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            user,
            how: 'username'
          })
        });
  
        if (!response.ok) {
          throw new Error(`TOTO API Error: ${response.status}`);
        }
  
        return response.json();
      } catch (error) {
        console.error(`Error calling ${endpoint}:`, error);
        throw error;
      }
    }
  
    async analyzeHandle(handle) {
      try {
        const cleanHandle = handle.replace('@', '');
        
        const [latestMetadata, pastUsernames] = await Promise.all([
          this.makeRequest('get_latest_metadata', cleanHandle),
          this.makeRequest('get_past_usernames', cleanHandle)
        ]);
  
        return {
          success: true,
          data: {
            metadata: latestMetadata,
            pastUsernames: pastUsernames
          }
        };
      } catch (error) {
        console.error('Twitter analysis failed:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
  }
  
  export const twitterService = new TwitterService();
  export default twitterService;