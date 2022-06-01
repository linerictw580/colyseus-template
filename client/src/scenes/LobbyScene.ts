import { Client, Room, RoomAvailable } from 'colyseus.js';
import { SCENES } from '~/models/scenes.model';
import BaseScene from './BaseScene';

export default class LobbyScene extends BaseScene {
  private _client: Client;
  private _lobby: Room;
  private _allRooms: RoomAvailable[] = [];

  constructor() {
    super({ key: SCENES.LOBBY });
  }

  init(data: { username: string }) {
    super.init();
    console.log('username = ', data.username);

    const hostWithPort = window.document.location.host;
    const host = hostWithPort.replace(/:.*/, '');
    const port = 2567;
    const endPoint = `ws://${host}:${port}`;
    // console.log(endPoint);

    this._client = new Client(endPoint);
    // this._client = new Client('ws://localhost:2567');
  }

  preload() {
    this.load.html('lobbyForm', 'assets/html/lobby.html');
  }

  create() {
    this.joinLobby();
    // const lobby = await this._client.joinOrCreate('lobby');

    // console.log(`room name = ${lobby.name}`);
    // console.log(`room session id = ${lobby.sessionId}`);

    // lobby.onMessage('rooms', (rooms) => {
    //   this._allRooms = rooms;
    //   console.log(`Available rooms: ${rooms}`);
    // });

    // lobby.onMessage('keydown', (msg) => {
    //   console.log(msg);
    // });

    // this.input.keyboard.on('keydown', (e) => {
    //   lobby.send('keydown', e.key);
    // });

    // let rect = this.add.rectangle(200, 200, 200, 100, 0xffffff);

    // let button = document.createElement('button');
    // let htmlButton = this.add.dom(200, 200).createElement('button', null, 'Button');

    this.createForm();
  }

  joinLobby() {
    this._client
      .joinOrCreate('custom_lobby')
      .then((roomInstance) => {
        this._lobby = roomInstance;
        console.log('Joined lobby room!');
        console.log(`room name = ${this._lobby.name}`);
        console.log(`room session id = ${this._lobby.sessionId}`);
        this.onJoin();
      })
      .catch((e) => {
        console.error('Error', e);
      });
  }

  onJoin() {
    this._lobby.onStateChange((state) => {
      console.log('Custon lobby state', state);
    });

    this._lobby.onMessage('rooms', (rooms) => {
      this._allRooms = rooms;
      console.log('Received full list of rooms:', this._allRooms);
      this.updateRoomList();
    });

    // room added
    this._lobby.onMessage('+', ([roomId, room]) => {
      console.log('Room added!');
      const roomIndex = this._allRooms.findIndex((room) => room.roomId === roomId);
      if (roomIndex !== -1) {
        this._allRooms[roomIndex] = room;
      } else {
        this._allRooms.push(room);
      }
      this.updateRoomList();
    });

    // room removed
    this._lobby.onMessage('-', (roomId) => {
      console.log('Room removed!');
      this._allRooms = this._allRooms.filter((room) => room.roomId !== roomId);
      this.updateRoomList();
    });

    this._lobby.onLeave(() => {
      this._allRooms = [];
      console.log('Left lobby room!');
    });
  }

  createForm() {
    const lobbyForm = this.add.dom(200, 200).createFromCache('lobbyForm');

    lobbyForm.addListener('click');
    lobbyForm.on('click', (e) => {
      const elemName = e.target.name;
      switch (elemName) {
        case 'createButton':
          this.createNewRoom();
          break;

        case 'joinButton':
          const roomId = lobbyForm.getChildByName('roomId')['value'];
          this.joinExistingRoom(roomId);
          break;

        case 'leaveButton':
          this.leaveLobby();
          break;
      }
    });

    // const button = this.add.dom(400, 100, 'button', {}, 'Create New Room');
    // button.addListener('click');
    // button.on('click', () => {
    //   console.log('click');
    // });
  }

  createNewRoom() {
    console.log(`Create room`);
    this.scene.start(SCENES.GAME, { create: true });
    this._lobby?.leave();
  }

  joinExistingRoom(roomId: string) {
    console.log(`Join room: ${roomId}`);
    this.scene.start(SCENES.GAME, { create: false, roomId: roomId });
    this._lobby?.leave();
  }

  updateRoomList() {
    const roomList = document.getElementById('roomList');
    if (roomList) {
      roomList.innerHTML = this._allRooms
        .map((room) => {
          return `<li>${JSON.stringify(room)}</li>`;
        })
        .join('\n');
    }
  }

  leaveLobby() {
    this._lobby?.leave();
    this.scene.start(SCENES.LOGIN);
  }
}
