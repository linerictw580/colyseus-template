import { Client } from 'colyseus.js';
import { config } from '~/constant';
import { SCENES } from '~/models/scenes.model';
import BaseScene from './BaseScene';

export default class LoginScene extends BaseScene {
  private _client: Client;

  constructor() {
    super({ key: SCENES.LOGIN });
  }

  init() {
    super.init();
    console.log(process.env.NODE_ENV);
    console.log(config.webSocket.endPoint);
    this._client = new Client(config.webSocket.endPoint);
  }

  preload() {
    this.load.html('loginForm', 'assets/html/login.html');
  }

  async create() {
    const loginForm = this.add
      .dom(this.screenCenterX, this.screenCenterY)
      .createFromCache('loginForm');

    loginForm.addListener('click');
    loginForm.on('click', (event) => {
      if (event.target.name === 'loginButton') {
        const username = loginForm.getChildByName('username')['value'];
        this.scene.start(SCENES.LOBBY, { username });
      }
    });
  }
}
