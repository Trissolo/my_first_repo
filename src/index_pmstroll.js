import Phaser from 'phaser';
import SceneA from './scenes/SceneA.js'

const config = {
    type: Phaser.WEBGL,
    pixelArt: true,
    backgroundColor: '#232323', //'#320822',
    disableContextMenu: true,
    scale:
    {
      mode: Phaser.Scale.NONE,
      //autoCenter: Phaser.Scale.CENTER_BOTH,
      
      width: 256,
      height: 128,
      zoom: 3
      
      //width:600, height:400, zoom:2
    },
    /*
    loader:
    {
      baseURL: 'https://gist.githubusercontent.com/Trissolo/0135ed23866b2134016e566365718f60/raw/63e4e9132d75240701b2d54c8e07b1444805cce6',
      crossOrigin: 'anonymous'
    },
    */
    scene: [SceneA]//, SceneB]
  };

  window.game = new Phaser.Game(config)
