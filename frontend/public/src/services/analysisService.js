// Mock service to provide dashboard data without breaking the existing logic
// In a real application, these would call your backend APIs

export async function getAnalysisStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalArticles: 128491,
        avgBias: 0.42,
        neutralRatio: 54.8,
        activeSources: 142
      });
    }, 500);
  });
}

export async function getRecentAnalyses(limit = 6) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Policy Shift Sparks Controversy in Capital", source: "Fox News", biasScore: 0.85, sentimentScore: -0.4, timestamp: { toDate: () => new Date() }, topic: "Politics" },
        { id: 2, title: "New Economic Reform Promises Stability", source: "BBC", biasScore: -0.1, sentimentScore: 0.6, timestamp: { toDate: () => new Date() }, topic: "Economy" },
        { id: 3, title: "Tech Giants Face New Regulations", source: "The Guardian", biasScore: -0.65, sentimentScore: -0.2, timestamp: { toDate: () => new Date() }, topic: "Technology" },
        { id: 4, title: "Global Health Summit Reaches Agreement", source: "Reuters", biasScore: 0.05, sentimentScore: 0.8, timestamp: { toDate: () => new Date() }, topic: "Health" },
        { id: 5, title: "Market Volatility Hits Record Highs", source: "CNN", biasScore: -0.75, sentimentScore: -0.8, timestamp: { toDate: () => new Date() }, topic: "Economy" },
      ].slice(0, limit));
    }, 600);
  });
}
