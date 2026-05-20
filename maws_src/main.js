import { GameStore } from './simulation/state.js';
import { BootScene } from './phaser/scenes/BootScene.js';
import { ShellScene } from './phaser/scenes/ShellScene.js';
import { initMawsDomUI } from './dom/ui.js';

const store = new GameStore();
window.MAWS_STORE = store;
initMawsDomUI(store, document.getElementById('maws-ui-root'));

const PhaserRuntime = window.Phaser;
if (!PhaserRuntime) {
  throw new Error('Phaser vendor 未加载');
}

const config = {
  type: PhaserRuntime.AUTO,
  parent: 'game-root',
  backgroundColor: '#050506',
  scale: {
    mode: PhaserRuntime.Scale.RESIZE,
    parent: 'game-root',
    width: window.innerWidth,
    height: window.innerHeight
  },
  render: {
    antialias: true,
    pixelArt: false
  },
  scene: [
    new BootScene(store),
    ShellScene
  ]
};

try {
  window.MAWS_GAME = new PhaserRuntime.Game(config);
} catch (error) {
  console.error(error);
  const fallback = document.getElementById('fallback');
  fallback.hidden = false;
  fallback.textContent = `Phaser 初始化失败：${error.message}`;
}
