import { eventDispatcher } from './game-events';

export const Analytics = {
  init() {
    eventDispatcher.subscribe((event) => {
      console.log("[ANALYTICS]", event.type, event.payload);
      const history = JSON.parse(localStorage.getItem('fren_factory_analytics') || '[]');
      history.push(event);
      localStorage.setItem('fren_factory_analytics', JSON.stringify(history));
    });
  },
  
  getHistory() {
    return JSON.parse(localStorage.getItem('fren_factory_analytics') || '[]');
  },

  clear() {
    localStorage.removeItem('fren_factory_analytics');
  }
};
