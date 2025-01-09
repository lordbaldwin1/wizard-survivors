import { Player } from '../objects/Player';
import { BGMan } from '../BGMan';
import { PlayerUI } from '../objects/PlayerUI';
import { EnemyPool } from '../objects/EnemyPool';

const enemyConfigs = [
    { key: 'priest', startTime: 0 },  // Default enemy
    { key: 'priest', startTime: 30 }, // Spawns after 30 seconds
    { key: 'priest', startTime: 60 }, // Spawns after 60 seconds
];

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create() {
        this.timer = 0;
        this.spawnInterval = 500;

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

        this.enemyPool = new EnemyPool(this, enemyConfigs, 5);
        this.physics.add.collider(this.player, this.enemyPool, this.handlePlayerEnemyCollision.bind(this));
        this.physics.add.collider(this.enemyPool, this.enemyPool);
        
        this.time.addEvent({
            delay: this.spawnInterval,
            callback: () => {
                const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(this.rectOuter, this.rectInner);
                this.enemyPool.getEnemy(this.timer, spawnPoint.x, spawnPoint.y);
            },
            loop: true
        });
    }

    update(time, delta) {
        this.timer += delta / 1000;

        //console.log(this.player.x, this.player.y);

        this.bgManager.update(this.player.x, this.player.y);
        this.player.update(this.keys);
        this.updateSpawnRect(this.player.x, this.player.y);
        this.enemyPool.children.iterate(enemy => {
            if (enemy.active) {
                enemy.update(this.player);
            }
        })
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
