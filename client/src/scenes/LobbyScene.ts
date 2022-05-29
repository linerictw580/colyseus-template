import { Client, RoomAvailable } from 'colyseus.js';

export default class LobbyScene extends Phaser.Scene {
  private _client: Client;
  private _allRooms: RoomAvailable[] = [];

  constructor() {
    super('game-scene');
  }

  init() {
    this._client = new Client('ws://localhost:2567');
    this.scale.on('orientationchange', this.checkOrientation);
  }

  preload() {}

  async create() {
    const lobby = await this._client.joinOrCreate('lobby');

    console.log(`room name = ${lobby.name}`);
    console.log(`room session id = ${lobby.sessionId}`);

    lobby.onMessage('rooms', (rooms) => {
      this._allRooms = rooms;
      console.log(`Available rooms: ${rooms}`);
    });

    lobby.onMessage('keydown', (msg) => {
      console.log(msg);
    });

    this.input.keyboard.on('keydown', (e) => {
      lobby.send('keydown', e.key);
    });
  }

  checkOrientation = (orientation) => {
    switch (orientation) {
      case Phaser.Scale.PORTRAIT:
        console.log('PORTRAIT');
        break;

      case Phaser.Scale.LANDSCAPE:
        console.log('LANDSCAPE');
        break;
    }
  };
}
