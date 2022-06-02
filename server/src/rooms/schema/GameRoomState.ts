import { Schema, type, MapSchema } from '@colyseus/schema';

export class Player extends Schema {
  @type('number') x = Math.floor(Math.random() * 400);
  @type('number') y = Math.floor(Math.random() * 400);
}

export class GameRoomState extends Schema {
  @type('number') currentState: number;
  @type({ map: Player }) players = new MapSchema<Player>();

  createPlayer(sessionId: string) {
    this.players.set(sessionId, new Player());
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

  movePlayer(sessionId: string, movement: any) {
    const player = this.players.get(sessionId);
    if (movement.x) {
      player.x += movement.x * 10;
    } else if (movement.y) {
      player.y += movement.y * 10;
    }
  }
}
