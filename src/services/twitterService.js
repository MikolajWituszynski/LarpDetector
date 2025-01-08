// backend/services/twitterService.js
const express = require('express');
const cors = require('cors');
const router = express.Router();

// Twitter API v2 configuration
const TWITTER_API_BASE = 'https://api.twitter.com/2';
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

const headers = {
  'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
  'Content-Type': 'application/json',
};

// Fetch user profile and metrics
async function fetchUserProfile(handle) {
  const userFields = [
    'created_at',
    'description',
    'profile_image_url',
    'protected',
    'public_metrics',
    'url',
    'username',
    'verified',
    'withheld'
  ].join(',');

  const response = await fetch(
    `${TWITTER_API_BASE}/users/by/username/${handle}?user.fields=${userFields}`,
    { headers }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Failed to fetch Twitter user data');
  }

  return response.json();
}

// Fetch recent tweets for engagement analysis
async function fetchUserTweets(userId) {
  const tweetFields = [
    'created_at',
    'public_metrics',
    'referenced_tweets'
  ].join(',');

  const response = await fetch(
    `${TWITTER_API_BASE}/users/${userId}/tweets?max_results=100&tweet.fields=${tweetFields}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch user tweets');
  }

  return response.json();
}

// Calculate engagement metrics
function calculateEngagementMetrics(tweets) {
  if (!tweets?.length) return null;

  const metrics = tweets.reduce((acc, tweet) => {
    const { public_metrics } = tweet;
    acc.likes += public_metrics?.like_count || 0;
    acc.retweets += public_metrics?.retweet_count || 0;
    acc.replies += public_metrics?.reply_count || 0;
    return acc;
  }, { likes: 0, retweets: 0, replies: 0 });

  const totalEngagements = metrics.likes + metrics.retweets + metrics.replies;
  const avgEngagements = totalEngagements / tweets.length;
  
  return {
    avgLikes: Math.round(metrics.likes / tweets.length),
    avgRetweets: Math.round(metrics.retweets / tweets.length),
    engagementRate: ((avgEngagements / tweets.length) * 100).toFixed(2)
  };
}

// Calculate account risk score
function calculateRiskScore(profile, tweets) {
  let score = 100;
  const riskFactors = [];

  // Account age check
  const accountAge = new Date() - new Date(profile.created_at);
  const accountAgeMonths = accountAge / (1000 * 60 * 60 * 24 * 30);
  
  if (accountAgeMonths < 3) {
    score -= 30;
    riskFactors.push('Account less than 3 months old');
  } else if (accountAgeMonths < 6) {
    score -= 15;
    riskFactors.push('Account less than 6 months old');
  }

  // Follower check
  if (profile.public_metrics.followers_count < 100) {
    score -= 20;
    riskFactors.push('Low follower count');
  }

  // Engagement check
  const engagement = calculateEngagementMetrics(tweets);
  if (engagement && parseFloat(engagement.engagementRate) < 0.1) {
    score -= 15;
    riskFactors.push('Very low engagement rate');
  }

  // Profile completeness check
  if (!profile.description || !profile.profile_image_url) {
    score -= 10;
    riskFactors.push('Incomplete profile');
  }

  return {
    score: Math.max(0, score),
    level: score > 70 ? 'low' : score > 40 ? 'medium' : 'high',
    factors: riskFactors
  };
}

// API endpoint
router.get('/analyze/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    
    // Fetch user profile
    const userResponse = await fetchUserProfile(handle);
    const user = userResponse.data;
    
    // Fetch user tweets
    const tweetsResponse = await fetchUserTweets(user.id);
    const tweets = tweetsResponse.data || [];
    
    // Calculate engagement metrics
    const engagementMetrics = calculateEngagementMetrics(tweets);
    
    // Calculate risk assessment
    const risk = calculateRiskScore(user, tweets);

    // Format response
    const response = {
      profile: {
        username: user.username,
        displayName: user.name,
        description: user.description,
        profileImage: user.profile_image_url,
        verified: user.verified,
        protected: user.protected,
        created_at: user.created_at
      },
      metrics: {
        followers: user.public_metrics.followers_count,
        following: user.public_metrics.following_count,
        tweets: user.public_metrics.tweet_count,
        ...engagementMetrics,
        accountAgeYears: Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365))
      },
      risk
    };

    res.json(response);
  } catch (error) {
    console.error('Twitter analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze Twitter handle',
      message: error.message 
    });
  }
});

module.exports = router;