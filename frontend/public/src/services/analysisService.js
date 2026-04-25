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
