// src/services/trustScore.js

/**
 * Calculates a comprehensive trust score for a GitHub repository
 * Emphasizes contributor quality and active maintenance
 */
export const calculateTrustScore = (repoData) => {
    if (!repoData) return 0;
    
    let score = 0;
    const scores = {
      repoAge: 0,
      contributorTrust: 0,
      activityConsistency: 0,
      codeQuality: 0,
      communityEngagement: 0
    };
  
    // 1. Repository Age Score (Max 15 points)
    // More forgiving on age if other factors are strong
    if (repoData.timeMetrics) {
      const ageInDays = repoData.timeMetrics.age;
      if (ageInDays >= 365) scores.repoAge = 15;
      else if (ageInDays >= 180) scores.repoAge = 12;
      else if (ageInDays >= 90) scores.repoAge = 10;  // 3 months is reasonable for active projects
      else scores.repoAge = 8;  // Even new projects get base points if other signals are good
    }
  
    // 2. Contributor Trust Score (Max 35 points) - Increased weight for quality contributors
    if (repoData.contributors) {
      const contributors = repoData.contributors;
      let contributorScore = 0;
  
      // Even a small number of quality contributors is good
      if (contributors.numberOfContributors >= 3) contributorScore += 15;
      else if (contributors.numberOfContributors >= 2) contributorScore += 10;
      else contributorScore += 5;  // Single developer can still be legitimate
  
      // Contribution distribution is less critical for small teams
      const topContributorPercentage = contributors.contributionDistribution?.[0]?.percentage || 100;
      if (topContributorPercentage < 80) contributorScore += 10;
      else if (topContributorPercentage < 90) contributorScore += 5;
  
      // Contributor history is very important
      if (repoData.contributorProfiles) {
        const trustedContributors = repoData.contributorProfiles.filter(profile => {
          return profile.accountAge > 90 && profile.publicRepos > 0;  // More lenient requirements
        }).length;
  
        if (trustedContributors >= 2) contributorScore += 10;
        else if (trustedContributors >= 1) contributorScore += 8;
      }
  
      scores.contributorTrust = Math.min(35, contributorScore);
    }
  
    // 3. Activity Consistency Score (Max 20 points)
    if (repoData.commitAnalysis) {
      let activityScore = 0;
      const { frequency, isConsistent, activityPatterns } = repoData.commitAnalysis;
  
      // Any regular activity is good
      if (frequency > 20) activityScore += 10;
      else if (frequency > 10) activityScore += 8;
      else if (frequency > 5) activityScore += 6;
      else activityScore += 4;  // Even low activity can be ok if consistent
  
      // Consistent activity patterns
      if (isConsistent) activityScore += 5;
  
      // Natural activity distribution
      if (activityPatterns) {
        const hasReasonablePattern = 
          Object.keys(activityPatterns.timeDistribution).length > 4;  // More lenient pattern check
        if (hasReasonablePattern) activityScore += 5;
      }
  
      scores.activityConsistency = Math.min(20, activityScore);
    }
  
    // 4. Code Quality Score (Max 15 points)
    if (repoData.codeQuality) {
      let qualityScore = 0;
      
      // Basic documentation is good enough
      if (repoData.codeQuality.hasReadme) qualityScore += 5;
      if (repoData.codeQuality.hasLicense) qualityScore += 5;
  
      // Some code standards
      if (repoData.codeQuality.codeStyle) {
        if (repoData.codeQuality.codeStyle.hasLinter) qualityScore += 2.5;
        if (repoData.codeQuality.codeStyle.hasTypeChecking) qualityScore += 2.5;
      }
  
      scores.codeQuality = Math.min(15, qualityScore);
    }
  
    // 5. Community Engagement Score (Max 15 points)
    if (repoData.repoData) {
      let engagementScore = 0;
      
      // Any community interest is positive
      const stars = repoData.repoData.stargazers_count || 0;
      const forks = repoData.repoData.forks_count || 0;
  
      if (stars >= 100) engagementScore += 8;
      else if (stars >= 50) engagementScore += 6;
      else if (stars >= 10) engagementScore += 4;
      else engagementScore += 2;  // Even a few stars show some interest
  
      if (forks >= 10) engagementScore += 7;
      else if (forks >= 5) engagementScore += 5;
      else if (forks >= 2) engagementScore += 3;
  
      scores.communityEngagement = Math.min(15, engagementScore);
    }
  
    // Calculate final score
    score = Object.values(scores).reduce((sum, value) => sum + value, 0);
  
    // Return detailed breakdown along with total score
    return {
      score,
      breakdown: scores,
      riskLevel: getRiskLevel(score),
      trustFactors: getTrustFactors(scores),
      riskFactors: getRiskFactors(scores, repoData)
    };
  };
  
  const getRiskLevel = (score) => {
    if (score >= 85) return 'very_low';
    if (score >= 70) return 'low';
    if (score >= 50) return 'moderate';
    if (score >= 30) return 'elevated';
    return 'high';
  };
  
  const getTrustFactors = (scores) => {
    const factors = [];
    
    if (scores.repoAge >= 10) factors.push('Established Project');
    if (scores.contributorTrust >= 25) factors.push('Trusted Contributors');
    if (scores.activityConsistency >= 15) factors.push('Consistent Development');
    if (scores.codeQuality >= 10) factors.push('Quality Standards');
    if (scores.communityEngagement >= 10) factors.push('Active Community');
  
    return factors;
  };
  
  const getRiskFactors = (scores, repoData) => {
    const factors = [];
    
    // Only flag serious concerns
    if (scores.contributorTrust < 15) factors.push('Limited Contributor History');
    if (scores.activityConsistency < 8) factors.push('Very Low Activity');
    if (scores.codeQuality < 5) factors.push('Missing Basic Documentation');
    
    return factors;
  };