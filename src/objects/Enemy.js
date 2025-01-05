import { ENEMY_DATA } from './EnemyData';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, enemyType) {
        const enemyData = ENEMY_DATA[enemyType];

        if (!enemyData) {
            throw new Error(`Enemy type "${enemyType}" not found in ENEMY_DATA.`);
        }

        super(scene, x, y, enemyData.texture);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.radius = 18;
        this.body.setCircle(this.radius, 0, 0);


        this.health = enemyData.maxHealth;
        this.speed = enemyData.speed;

        this.active = false;
    }

    init(x, y) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.health = 10;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.despawn();
        }
    }

    despawn() {
        this.setActive(false);
        this.setVisible(false);
        this.body.stop();
    }

    update(player) {
        if (this.active) {
            this.scene.physics.moveToObject(this, player, this.speed);
        }
    }
}
