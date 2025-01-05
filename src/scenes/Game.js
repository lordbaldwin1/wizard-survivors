import { Player } from '../objects/Player';
import { Priest } from '../objects/Priest';
import { Enemy } from '../objects/Enemy';
import { BGMan } from '../BGMan';
import { EnemyGroup } from '../objects/EnemyGroup';
import { PlayerUI } from '../objects/PlayerUI';
import { EnemyPool } from '../objects/EnemyPool';

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create() {
        this.keys = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };

        this.bgManager = new BGMan(this);
        this.bgManager.makeBackground('bgTile');

        this.player = new Player(this, 0, 0, 'player', this.keys);
        this.cameras.main.startFollow(this.player);

        this.playerUI = new PlayerUI(this, this.player);
        this.playerUI.updateHealthBar();
        
        //this.cameras.main.setZoom(0.5);
        this.enemies = new EnemyGroup(this, 'priest');
        this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision.bind(this));
        this.physics.add.collider(this.enemies, this.enemies);

        this.rectOuter = new Phaser.Geom.Rectangle(
            0,
            0,
            this.renderer.width + 200,
            this.renderer.height + 200
        )
        this.rectInner = new Phaser.Geom.Rectangle(
            0,
            0,
            this.renderer.width + 100,
            this.renderer.height + 100
        )

        this.time.addEvent({
            delay       : 1000,
            loop        : true,
            callback    : () => {
                const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(this.rectOuter, this.rectInner);
                this.enemies.spawn(spawnPoint.x, spawnPoint.y); 
            },
        });
    }

    update(time, delta) {
        //console.log(this.player.x, this.player.y);
        this.bgManager.update(this.player.x, this.player.y);
        this.player.update(this.keys);
        //this.playerUI.updateHealthBar();
        this.enemies.update(this.player);
        this.updateSpawnRect(this.player.x, this.player.y);
    }

    updateSpawnRect(playerX, playerY) {
        let outerWidth = this.renderer.width + 200;
        let outerHeight = this.renderer.height + 200;
        let innerWidth = this.renderer.width + 100;
        let innerHeight = this.renderer.height + 100;

        this.rectOuter.x = playerX - 0.5 * outerWidth;
        this.rectOuter.y = playerY - 0.5 * outerHeight;

        this.rectInner.x = this.rectOuter.x + 0.5 * (outerWidth - innerWidth);
        this.rectInner.y = this.rectOuter.y + 0.5 * (outerHeight - innerHeight);
    }

    handlePlayerEnemyCollision() {
        console.log("COLLISION");
        this.player.takeDamage(2, this.playerUI);
    }
}
