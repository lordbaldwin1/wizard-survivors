export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.radius = 18;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setCircle(this.radius, 0, 0);
        this.setImmovable(true);

        this.lastDirection = { x: 1, y: 0 };
        this.speed = 125;

        this.worldBoxCollider = new Phaser.Geom.Rectangle(0, 0, this.scene.renderer.width, this.scene.renderer.height);

        this.health = 10;
        this.maxHealth = 10;

        this.receivingDamage = false;
    }

    update(keys) {
        const velocityX = (keys.right.isDown - keys.left.isDown) * this.speed;
        const velocityY = (keys.down.isDown - keys.up.isDown) * this.speed;

        const velocityVector = new Phaser.Math.Vector2(velocityX, velocityY);
       
        // If 0 vector, don't normalize
        if (velocityX !== 0 || velocityY !== 0) {
            velocityVector.normalize().scale(this.speed);
            if (velocityX < 0) {
                this.setFlipX(true);
            } else if (velocityX > 0) {
                this.setFlipX(false);
            }
            this.lastDirection = { x: velocityX, y: velocityY };
        }

        this.setVelocity(velocityVector.x, velocityVector.y);

        this.worldBoxCollider.x = this.x - 0.5 * this.scene.renderer.width
        this.worldBoxCollider.y = this.y - 0.5 * this.scene.renderer.height
    }

    takeDamage(amount, playerUI) {
        if (this.receivingDamage === false) {
            if (this.health <= 0) {
                return;
                // TODO: Game over, switch scene
            } else {
                this.health -= amount;
                playerUI.updateHealthBar();
                this.whenDamaged();
            }
        }
    }

    whenDamaged(fill = 16711680, delay = 200) {
        if(!this.receivingDamage) {
            this.setTintFill(fill);
            this.damageTimeout = this.scene.time.addEvent({
                delay: delay,
                loop: false,
                callback: () => {
                    this.restoreTint()
                }
            });
            this.receivingDamage = true;
        }
    }

    restoreTint() {
            this.setTint(0xffffff);
            this.receivingDamage = false;
    }
}


