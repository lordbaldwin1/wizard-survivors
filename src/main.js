import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

const config = {
    type: Phaser.AUTO,
    width: 720,
    height: 450,
    pixelArt: true,
    roundPixels: true,
    parent: 'game-container',
    backgroundColor: 'green',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true,
        },
    },
    plugins: {
        key: 'rexUI',
        plugin: RexUIPlugin,
        start: true
    },
    scene: [Boot, Preloader, MainMenu, Game]
};

export default new Phaser.Game(config);
