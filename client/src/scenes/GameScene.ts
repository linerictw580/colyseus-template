import * as Colyseus from 'colyseus.js';

export default class GameScene extends Phaser.Scene {
  private client: Colyseus.Client;

  constructor() {
    super('game-scene');
  }

  init() {
    this.client = new Colyseus.Client('ws://localhost:2567');
    this.scale.on('orientationchange', this.checkOrientation);
  }

  preload() {}

  async create() {
    const room = await this.client.joinOrCreate('my_room');

    console.log(`room name = ${room.name}`);
    console.log(`room session id = ${room.sessionId}`);

    room.onMessage('keydown', (msg) => {
      console.log(msg);
    });

    this.input.keyboard.on('keydown', (e) => {
      room.send('keydown', e.key);
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
