import { Client, RoomAvailable } from 'colyseus.js';
import { SCENES } from '~/models/scenes.model';
import BaseScene from './BaseScene';

export default class LobbyScene extends BaseScene {
  private _client: Client;
  private _allRooms: RoomAvailable[] = [];

  constructor() {
    super({ key: SCENES.LOBBY });
  }

  init(data: { username: string }) {
    super.init();
    console.log('username = ', data.username);
    this._client = new Client('ws://localhost:2567');
  }

  preload() {
    this.load.html('lobby', 'assets/html/lobby.html');
    this.load.image('bg', 'assets/bg.jpg');
  }

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

    // let rect = this.add.rectangle(200, 200, 200, 100, 0xffffff);

    // let button = document.createElement('button');
    // let htmlButton = this.add.dom(200, 200).createElement('button', null, 'Button');

    this.createForm();
  }

  createForm() {
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const form = this.add.dom(screenCenterX, screenCenterY).createFromCache('lobby');
    // form.setPerspective(800);

    const button = this.add.dom(400, 100, 'button', {}, 'Create New Room');
    button.addListener('click');
    button.on('click', () => {
      console.log('click');
    });

    // let div = document.createElement('div');
    // this.add.dom(100, 100, 'div', 'width: 200px; height: 200px; border: 1px solid black;');
    // var style = {
    //   'background-color': 'lime',
    //   width: '220px',
    //   height: '100px',
    //   font: '48px Arial',
    //   'font-weight': 'bold',
    // };

    // var element = this.add.dom(400, 300, 'div', style, 'Phaser 3');
  }
}
