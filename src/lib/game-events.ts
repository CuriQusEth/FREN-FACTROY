export type GameEvent = {
  type: string;
  payload: any;
  timestamp: number;
};

class GameEventDispatcher {
  listeners: ((event: GameEvent) => void)[] = [];
  
  dispatch(type: string, payload: any) {
    const event = { type, payload, timestamp: Date.now() };
    this.listeners.forEach(l => l(event));
  }
  
  subscribe(listener: (event: GameEvent) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export const eventDispatcher = new GameEventDispatcher();
