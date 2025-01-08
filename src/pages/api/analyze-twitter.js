// pages/api/analyze-twitter.js

import { calculateRiskLevel } from '../../services/twitterAPI';

// You'll need to add these to your .env file
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const TWITTER_API_BASE = 'https://api.twitter.com/2';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { handle } = req.body;

  if (!handle) {
    return res.status(400).json({ message: 'Twitter handle is required' });
  }

  try {
    // Get user data
    const userData = await fetchTwitterUser(handle);
    
    // Get timeline data
    const timelineData = await fetchUserTimeline(userData.id);
    
    // Get follower metrics
    const followerMetrics = await fetchFollowerMetrics(userData.id);

    // Analyze the data
    const analysis = analyzeUserData(userData, timelineData, followerMetrics);

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Twitter analysis error:', error);
    return res.status(500).json({ 
      message: 'Failed to analyze Twitter handle',
      error: error.message 
    });
  }
}

async function fetchTwitterUser(handle) {
  const response = await fetch(
    `${TWITTER_API_BASE}/users/by/username/${handle}?user.fields=created_at,public_metrics,verified`,
    {
      headers: {
        'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Twitter user data');
  }

  const data = await response.json();
  return data.data;
}

async function fetchUserTimeline(userId) {
  const response = await fetch(
    `${TWITTER_API_BASE}/users/${userId}/tweets?max_results=100&tweet.fields=created_at,public_metrics`,
    {
      headers: {
        'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch user timeline');
  }

  const data = await response.json();
  return data.data || [];
}

async function fetchFollowerMetrics(userId) {
  const response = await fetch(
    `${TWITTER_API_BASE}/users/${userId}/followers?max_results=1000`,
    {
      headers: {
        'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch follower metrics');
  }

  const data = await response.json();
  return data.meta;
}

function analyzeUserData(userData, timelineData, followerMetrics) {
  // Calculate metrics
  const accountAge = new Date() - new Date(userData.created_at);
  const accountAgeInDays = Math.floor(accountAge / (1000 * 60 * 60 * 24));
  
  // Calculate engagement rate
  const engagementRate = calculateEngagementRate(timelineData);
  
  // Calculate follower growth (if available)
  const followerGrowth = "N/A"; // You'll need historical data for this

  const analysis = {
    currentHandle: userData.username,
    previousHandles: [], // Twitter API doesn't provide this directly
    riskLevel: calculateRiskLevel({
      created_at: userData.created_at,
      followers_count: userData.public_metrics.followers_count,
      tweets_count: userData.public_metrics.tweet_count,
    }),
    lastVerified: new Date().toISOString(),
    verificationStatus: userData.verified ? "Verified" : "Unverified",
    metrics: {
      accountAge: accountAgeInDays,
      followerCount: userData.public_metrics.followers_count,
      followingCount: userData.public_metrics.following_count,
      tweetCount: userData.public_metrics.tweet_count,
      engagementRate: `${engagementRate}%`,
      followerGrowth: followerGrowth
    }
  };

  return analysis;
}

function calculateEngagementRate(tweets) {
  if (!tweets || tweets.length === 0) return 0;

  const totalEngagements = tweets.reduce((sum, tweet) => {
    const metrics = tweet.public_metrics || {};
    return sum + (
      (metrics.like_count || 0) +
      (metrics.retweet_count || 0) +
      (metrics.reply_count || 0)
    );
  }, 0);

  return ((totalEngagements / tweets.length) / tweets.length * 100).toFixed(2);
}