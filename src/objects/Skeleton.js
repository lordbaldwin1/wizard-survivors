export class Skeleton extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(1);
        this.setSize(40, 40);
        this.setCollideWorldBounds(true);
        this.health = 100;
        this.speed = 200;
        this.stopDistance = 5;
    }

    chaseTarget(target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const magnitude = Math.sqrt(dx ** 2 + dy ** 2);

        if (magnitude > this.stopDistance) {
            const normalizedX = (dx / magnitude) * this.speed;
            const normalizedY = (dy / magnitude) * this.speed;
            this.setVelocity(normalizedX, normalizedY);
        } else {
            this.setVelocity(0, 0);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        this.showDamageText(amount);

        if (this.health <= 0) {
            this.destroy();
        }
    }

    showDamageText(damage) {
        const damageText = this.scene.add.text(this.x, this.y, `-${damage}`, {
            font: '24px Arial',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 2,
        });

        // Animate the text
        this.scene.tweens.add({
            targets: damageText,
            y: this.y - 30, // Move upward
            alpha: 0,       // Fade out
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                damageText.destroy();
            },
        });
    }
}
