const PhaserScene = globalThis.Phaser?.Scene || class {};

export class ModalScene extends PhaserScene {
  constructor() {
    super('ModalScene');
  }
}
