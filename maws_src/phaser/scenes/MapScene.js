const PhaserScene = globalThis.Phaser?.Scene || class {};

export class MapScene extends PhaserScene {
  constructor() {
    super('MapScene');
  }
}
