import { flattenManifest } from '../../assets/manifest.js';

const PhaserScene = globalThis.Phaser?.Scene || class {};

export class BootScene extends PhaserScene {
  constructor(store) {
    super('BootScene');
    this.store = store;
  }

  preload() {
    flattenManifest().forEach(({ key, path, entry }) => {
      if (entry?.type === 'spritesheet') {
        this.load.spritesheet(key, path, {
          frameWidth: entry.frameWidth,
          frameHeight: entry.frameHeight
        });
        return;
      }
      this.load.image(key, path);
    });
  }

  create() {
    this.scene.start('ShellScene', { store: this.store });
  }
}
