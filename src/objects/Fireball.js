export class Fireball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(1);
        this.setSize(16, 16);
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
    }

    fire(x, y, direction) {
        this.setPosition(x, y);
        const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        const normalizedDirection = {
            x: direction.x / magnitude,
            y: direction.y / magnitude,
        };
        const speed = 600;
        this.setVelocity(normalizedDirection.x * speed, normalizedDirection.y * speed);
    }
}
