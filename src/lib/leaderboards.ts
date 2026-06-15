import { PlayerStats } from './player-stats';

export const Leaderboards = {
  getTopGooPlayers(limit: number = 10) {
    // In production, this would query a backend database.
    // Here we collect all local keys matching `player_stats_*`.
    const players = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('player_stats_')) {
            players.push(JSON.parse(localStorage.getItem(key)!));
        }
    }
    
    return players.sort((a, b) => b.totalGoo - a.totalGoo).slice(0, limit);
  },
  
  getTopFrenHatchers(limit: number = 10) {
    const players = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('player_stats_')) {
            players.push(JSON.parse(localStorage.getItem(key)!));
        }
    }
    
    return players.sort((a, b) => b.totalFrens - a.totalFrens).slice(0, limit);
  }
};
