const PhaserScene = globalThis.Phaser?.Scene || class {};

export class MenuScene extends PhaserScene {
  constructor() {
    super('MenuScene');
  }
}
