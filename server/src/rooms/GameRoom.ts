import { Client, Room } from 'colyseus';
import { GameRoomState } from './schema/GameRoomState';

export class GameRoom extends Room<GameRoomState> {
  onCreate(options: any) {
    console.log('GameRoom created!', options);

    this.setState(new GameRoomState());

    this.onMessage('move', (client, data) => {
      this.state.movePlayer(client.sessionId, data);
    });
  }

  onJoin(client: Client, options?: any, auth?: any): void | Promise<any> {
    this.state.createPlayer(client.sessionId);
  }

  onLeave(client: Client, consented?: boolean): void | Promise<any> {
    this.state.removePlayer(client.sessionId);
  }

  onDispose(): void | Promise<any> {}
}
