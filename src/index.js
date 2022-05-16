import Phaser from 'phaser';
import inGameManager from './plugins/inGameManager.mjs';

import Preload from './scenes/Preload.mjs'


const config = {
    type: Phaser.WEBGL,
    pixelArt: true,
    backgroundColor: '#320822',
    disableContextMenu: true,
    scale:
    {
      mode: Phaser.Scale.NONE,
      //autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 300,
      height: 200,
      zoom: 3
    },
    // loader:
    // {
    //   baseURL: '',
    //   crossOrigin: 'anonymous'
    // },
    input:
    {
      touch: false
    },
    fps:
    {
      target: 50
    },
    
    plugins: {
        global:[ {key: "inGameManager", plugin: inGameManager, start: true}]
    },
    
    scene: [Preload]
  }

window.game = new Phaser.Game(config)
