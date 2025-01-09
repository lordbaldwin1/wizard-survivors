import { ENEMY_DATA } from './EnemyData';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, enemyType) {
        super(scene, x, y, enemyType);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.radius = 12;
        this.body.setCircle(this.radius, 0, 0);
        this.body.setEnable(false);

        this.maxHealth = 10;
        this.health = 10;
        this.speed = 25;

        this.active = false;
    }

    spawn(x, y) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.setEnable(true);
        this.health = 10;

        //this.speed = config.speed;
        //this.health = config.health;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.despawn();
            //this.killAndHide();
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
