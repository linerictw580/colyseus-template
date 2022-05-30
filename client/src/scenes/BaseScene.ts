export default class BaseScene extends Phaser.Scene {
  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  init(data?: any) {
    this.scale.on('orientationchange', this.checkOrientation);
  }

  checkOrientation(orientation) {
    // console.log(orientation);
    switch (orientation) {
      case Phaser.Scale.PORTRAIT:
        console.log('PORTRAIT');
        break;

      case Phaser.Scale.LANDSCAPE:
        console.log('LANDSCAPE');
        break;
    }
  }

  get screenCenterX() {
    return this.cameras.main.worldView.x + this.cameras.main.width / 2;
  }

  get screenCenterY() {
    return this.cameras.main.worldView.y + this.cameras.main.height / 2;
  }
}
