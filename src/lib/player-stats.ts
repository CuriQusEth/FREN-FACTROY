import { Analytics } from './analytics';

export type PlayerStat = {
  address: string;
  totalGoo: number;
  totalFrens: number;
  lastActive: number;
  achievements: string[];
};

export const PlayerStats = {
  getProfile(address: string): PlayerStat {
    const raw = localStorage.getItem(`player_stats_${address}`);
    if (raw) return JSON.parse(raw);
    
    return {
      address,
      totalGoo: 0,
      totalFrens: 0,
      lastActive: Date.now(),
      achievements: []
    };
  },
  
  saveProfile(stat: PlayerStat) {
    stat.lastActive = Date.now();
    localStorage.setItem(`player_stats_${stat.address}`, JSON.stringify(stat));
  },
  
  incrementGoo(address: string, amount: number) {
    const profile = this.getProfile(address);
    profile.totalGoo += amount;
    this.saveProfile(profile);
  },
  
  addFren(address: string) {
    const profile = this.getProfile(address);
    profile.totalFrens += 1;
    this.saveProfile(profile);
  }
};
