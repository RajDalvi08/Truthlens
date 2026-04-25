import { getStats as fetchStats, getRecentAnalyses as fetchRecent, deleteAnalysis as fetchDelete, analyzeArticle as fetchAnalyze } from "./api";

export async function getAnalysisStats(userId) {
  return fetchStats(userId);
}

export async function getRecentAnalyses(limit = 6, userId) {
  return fetchRecent(limit, userId);
}

export async function deleteAnalysis(id, userId) {
  return fetchDelete(id, userId);
}

export async function analyzeArticle(data) {
  return fetchAnalyze(data);
}

// Mock function for Globe Page since backend doesn't provide regional data yet
export async function getRegionalBias() {
  return [
    { region: "North America", bias: "+0.42", trend: "Slight Right Shift", articles: 1250, bias_index: 42 },
    { region: "Europe", bias: "-0.15", trend: "Stable Left Lean", articles: 840, bias_index: 15 },
    { region: "Asia Pacific", bias: "+0.05", trend: "Neutral / Center", articles: 620, bias_index: 5 },
  ];
}

// Mock function for BiasNetwork since backend doesn't provide network graph data yet
export async function getNetworkData() {
  return [
    { id: 1, name: "Global News", x: 0, y: 2, z: 0, color: "#10b981", bias: -0.1 },
    { id: 2, name: "Conservative Post", x: 3, y: 0, z: -2, color: "#f59e0b", bias: 0.6 },
    { id: 3, name: "Left Tribune", x: -3, y: -1, z: 2, color: "#3b82f6", bias: -0.7 },
    { id: 4, name: "Centrist Daily", x: 1, y: -2, z: 1, color: "#10b981", bias: 0.05 },
    { id: 5, name: "Far Right Echo", x: 4, y: 2, z: 1, color: "#ef4444", bias: 0.9 },
    { id: 6, name: "Progressive Voice", x: -4, y: 1, z: -1, color: "#3b82f6", bias: -0.8 },
  ];
}

