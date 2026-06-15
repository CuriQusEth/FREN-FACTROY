import { Analytics } from './analytics';
import { PlayerStats } from './player-stats';
import { Leaderboards } from './leaderboards';

// These exports can be used by an MCP server to expose game state for AgentKit or general AI access.

export const MCPTools = {
  getPlayerProfile(address: string) {
    return PlayerStats.getProfile(address);
  },

  getPlayerStats(address: string) {
    return PlayerStats.getProfile(address);
  },

  getLeaderboard() {
    return Leaderboards.getTopGooPlayers(10);
  },

  getEconomyMetrics() {
    const analytics = Analytics.getHistory();
    const gooProduced = analytics.filter(e => e.type === 'produce_goo').length;
    const frensHatched = analytics.filter(e => e.type === 'hatch_fren').length;
    return {
      totalGooEvents: gooProduced,
      totalFrensHatched: frensHatched,
      totalTransactions: analytics.filter(e => e.type === 'transaction_initiated').length
    };
  },

  getMatchHistory() {
    // Since this is a clicker, we can return the hatch/merge history
    return Analytics.getHistory().filter(e => e.type === 'hatch_fren' || e.type === 'merge_frens');
  },

  getAchievementHistory(address: string) {
    return PlayerStats.getProfile(address).achievements;
  }
};
