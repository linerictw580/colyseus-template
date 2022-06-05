import { Client, Room } from 'colyseus.js';
import { config } from '~/constant';
import { SCENES } from '~/models/scenes.model';
import { GameRoomState } from '~/states/GameRoomState';
import { Player } from '~/states/Player';
import BaseScene from './BaseScene';

export default class GameScene extends BaseScene {
  private _client: Client;
  private _room: Room<GameRoomState>;
  private _players: { [key: string]: any };

  constructor() {
    super({ key: SCENES.GAME });
  }

  init(data?: any): void {
    super.init();
    this._client = new Client(config.webSocket.endPoint);
    this._players = {};
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
        this._room = roomInstance as Room<GameRoomState>;
        console.log(`Create room: ${this._room.id}`);
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
        this._room = roomInstance as Room<GameRoomState>;
        console.log(`Join room: ${this._room.id}`);
        this.onJoin();
      })
      .catch((e) => {
        console.error('Error', e);
      });
  }

  onJoin() {
    this._room.state.players.onAdd = (player, sessionId) => {
      const rect = this.add.rectangle(player.x, player.y, 100, 100, 0xff0000);
      player.onChange = (changes) => {
        rect.x = player.x;
        rect.y = player.y;
      };
      this._players[sessionId] = { instance: player, gameObject: rect };
    };

    this._room.state.players.onRemove = (player, sessionId) => {
      delete this._players[sessionId];
    };

    window.addEventListener('keydown', (e) => {
      // console.log(e.key);
      switch (e.key) {
        case 'ArrowUp':
          this._room.send('move', { y: -1 });
          break;

        case 'ArrowDown':
          this._room.send('move', { y: 1 });
          break;

        case 'ArrowLeft':
          this._room.send('move', { x: -1 });
          break;

        case 'ArrowRight':
          this._room.send('move', { x: 1 });
          break;
      }
    });
  }
}
