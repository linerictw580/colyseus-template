import { Client, Room } from 'colyseus.js';
import { SCENES } from '~/models/scenes.model';
import BaseScene from './BaseScene';

export default class GameScene extends BaseScene {
  private _client: Client;
  private _room: Room;

  constructor() {
    super({ key: SCENES.GAME });
  }

  init(data?: any): void {
    super.init();
    const endPoint = 'ws://localhost:2567';
    this._client = new Client(endPoint);
  }

  preload() {
    this.load.image('bg', 'assets/bg.jpg');
  }

  create(data: { create: boolean; roomId: string }) {
    if (data.create) {
      this.createRoom();
    } else {
      this.joinRoom(data.roomId);
    }

    this.add.image(this.screenCenterX, this.screenCenterY, 'bg');

    var style = {
      'background-color': 'lime',
      width: '220px',
      height: '100px',
      font: '48px Arial',
      'font-weight': 'bold',
    };
    this.add.dom(400, 300, 'div', style, 'Phaser 3');
  }

  createRoom() {
    this._client
      .create('game')
      .then((roomInstance) => {
        this._room = roomInstance;
        this.onJoin();
      })
      .catch((e) => {
        console.error('Error', e);
      });
  }

  joinRoom(roomId: string) {
    this._client
      .joinById(roomId)
      .then((roomInstance) => {
        this._room = roomInstance;
        this.onJoin();
      })
      .catch((e) => {
        console.error('Error', e);
      });
  }

  onJoin() {}
}
