import { Player } from '../objects/Player';
import { Skeleton } from '../objects/Skeleton';
import { Fireball } from '../objects/Fireball';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.player = new Player(this, 512, 384, 'character');

        this.skeletons = this.physics.add.group({
            classType: Skeleton, // Use the Skeleton class
            runChildUpdate: true, // Automatically update children
        });

        this.skeletons.get(212, 212, 'skeleton-head'); // Add a skeleton to the group
        this.skeletons.get(800, 800, 'skeleton-head');

        this.fireballs = this.physics.add.group({
            classType: Fireball,
            runChildUpdate: true,
        });
        this.physics.add.overlap(this.fireballs, this.skeletons, this.hitEnemy, null, this);
        this.time.addEvent({
            delay: 500,
            callback: this.autoFire,
            callbackScope: this,
            loop: true,
        })

        this.keys = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        };
    }

    update(time) {
        this.player.move(this.keys, time);
        this.player.autoFire(this.skeletons, this.fireballs, time);

        this.skeletons.children.iterate((skeleton) => {
            if (skeleton.active) {
                skeleton.chaseTarget(this.player);
            }
        });
    }

    hitEnemy(fireball, enemy) {
        fireball.destroy();

        if (enemy instanceof Skeleton) {
            enemy.takeDamage(50);
        }
    }
}
