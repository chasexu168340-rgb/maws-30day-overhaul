const PhaserScene = globalThis.Phaser?.Scene || class {};

export class BattleScene extends PhaserScene {
  constructor() {
    super('BattleScene');
  }
}
