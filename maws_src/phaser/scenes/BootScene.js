import { assetEntry, assetPath } from '../../assets/manifest.js';

const PhaserScene = globalThis.Phaser?.Scene || class {};

export const BOOT_ASSET_KEYS = Object.freeze(['bg.street.night', 'bg.home.day']);

export class BootScene extends PhaserScene {
  constructor(store) {
    super('BootScene');
    this.store = store;
  }

  preload() {
    BOOT_ASSET_KEYS.forEach((key) => {
      const entry = assetEntry(key);
      const path = assetPath(key);
      if (!entry || !path) throw new Error(`Boot asset missing from manifest: ${key}`);
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
