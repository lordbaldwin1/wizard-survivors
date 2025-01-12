import { Player } from '../objects/Player';
import { BGMan } from '../BGMan';
import { PlayerUI } from '../objects/PlayerUI';
import { Enemy, EnemyGroup } from '../objects/EnemyGroup';

export class Game extends Phaser.Scene {
    captionTextFormat =
        `Total:    %1
        Max:      %2
        Active:   %3
        Inactive: %4
        Used:     %5
        Free:     %6
        Full:     %7`;

    captionStyle = {
        fill: '#7fdbff',
        fontFamily: 'monospace',
        lineSpacing: 4
    };
    caption;
    group;

    constructor() {
        super({ key: 'Game' });
        this.EnemyGroup;

    }

    create() {
        this.caption = this.add.text(16, 16, '', this.captionStyle);

        this.keys = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };

        this.bgManager = new BGMan(this);
        this.bgManager.makeBackground('bgTile');

        this.player = new Player(this, 0, 0, 'player');
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.25);
        this.playerUI = new PlayerUI(this, this.player);
        this.playerUI.updateHealthBar();

        // Spawn Rectangle
        this.rectOuter = new Phaser.Geom.Rectangle(
            0,
            0,
            this.renderer.width + 200,
            this.renderer.height + 200
        );
        this.rectInner = new Phaser.Geom.Rectangle(
            0,
            0,
            this.renderer.width + 100,
            this.renderer.height + 100
        );

        // Enemy group
        this.enemyGroup = new EnemyGroup(this);
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(this.rectOuter, this.rectInner);
                this.enemyGroup.spawn(spawnPoint.x, spawnPoint.y);
            }
        });

        // Collisions
        this.physics.add.collider(this.player, this.enemyGroup, this.handlePlayerEnemyCollision.bind(this));
        this.physics.add.collider(this.enemyGroup, this.enemyGroup);
    }

    update(time, delta) {
        this.timer += delta / 1000;

        //console.log(this.player.x, this.player.y);

        this.bgManager.update(this.player.x, this.player.y);
        this.player.update(this.keys);
        this.updateSpawnRect(this.player.x, this.player.y);
        this.enemyGroup.update(this.player, this.rectInner, this.rectOuter);

        this.caption.setText(Phaser.Utils.String.Format(this.captionTextFormat, [
            this.enemyGroup.getLength(),
            this.enemyGroup.maxSize,
            this.enemyGroup.countActive(true),
            this.enemyGroup.countActive(false),
            this.enemyGroup.getTotalUsed(),
            this.enemyGroup.getTotalFree(),
            this.enemyGroup.isFull()
        ]));
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
        this.player.takeDamage(3);
        this.playerUI.updateHealthBar();
    }
}
