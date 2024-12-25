import { Player } from '../objects/Player';
import { Skeleton } from '../objects/Skeleton';
import { Fireball } from '../objects/Fireball';
import { DarkWizard } from '../objects/DarkWizard';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Player creation
        this.player = new Player(this, 512, 384, 'character');

        // Base enemies group
        this.enemies = this.physics.add.group({
            runChildUpdate: true, // Automatically update children
        });
    
        // Add skeletons to the enemies group
        this.skeletons = this.physics.add.group({
            classType: Skeleton,
            runChildUpdate: true,
        });
        this.enemies.add(this.skeletons.get(212, 212, 'skeleton-head'));
        this.enemies.add(this.skeletons.get(800, 800, 'skeleton-head'));
    
        // Add dark wizards to the enemies group
        this.darkwizards = this.physics.add.group({
            classType: DarkWizard,
            runChildUpdate: true,
        });
        this.enemies.add(this.darkwizards.get(800, 100, 'dark-wizard'));

        // Add fireballs
        this.fireballs = this.physics.add.group({
            classType: Fireball,
            runChildUpdate: true,
        });
        this.physics.add.overlap(this.fireballs, this.enemies, this.hitEnemy, null, this);
        this.time.addEvent({
            delay: 500,
            callback: this.autoFire,
            callbackScope: this,
            loop: true,
        })

        // Keyboard input
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
        this.player.autoFire(this.enemies, this.fireballs, time);

        this.skeletons.children.iterate((skeleton) => {
            if (skeleton.active) {
                skeleton.chaseTarget(this.player);
            }
        });

        this.darkwizards.children.iterate((darkwizard) => {
            if (darkwizard.active) {
                darkwizard.chaseTarget(this.player);
            }
        });
    }

    hitEnemy(fireball, enemy) {
        fireball.destroy();

        if (enemy instanceof Skeleton || enemy instanceof DarkWizard) {
            enemy.takeDamage(50);
        }
    }
}
