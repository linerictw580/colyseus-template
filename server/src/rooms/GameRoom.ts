import { Schema, type } from '@colyseus/schema';
import { Client, Room } from 'colyseus';

export class Player extends Schema {
  @type('number') x = Math.floor(Math.random() * 400);
  @type('number') y = Math.floor(Math.random() * 400);
}

export class GameRoomState extends Schema {
  @type('number') currentState: number;
}

export class GameRoom extends Room<GameRoomState> {
  onCreate(options: any) {
    console.log('GameRoom created!', options);

    this.setState(new GameRoomState());
  }

  onJoin(client: Client, options?: any, auth?: any): void | Promise<any> {}

  onLeave(client: Client, consented?: boolean): void | Promise<any> {}

  onDispose(): void | Promise<any> {}
}
