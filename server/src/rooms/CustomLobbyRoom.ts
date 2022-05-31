import { LobbyOptions } from '@colyseus/core/build/rooms/LobbyRoom';
import { Schema, type } from '@colyseus/schema';
import { Client, LobbyRoom } from 'colyseus';

class LobbyState extends Schema {
  @type('string') custom: string;
}

export class CustomLobbyRoom extends LobbyRoom {
  async onCreate(options: any) {
    await super.onCreate(options);

    this.setState(new LobbyState());
  }

  onJoin(client: Client, options: LobbyOptions) {
    super.onJoin(client, options);
    this.state.custom = client.sessionId;
  }

  onLeave(client: Client) {
    super.onLeave(client);
  }
}
