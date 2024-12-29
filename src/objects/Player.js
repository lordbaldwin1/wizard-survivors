export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(1);

        this.lastDirection = { x: 1, y: 0 };
        this.speed = 125;
        this.isDashing = false;
        this.lastDashTime = 0;

        this.fireRate = 1500;
        this.lastFireTime = 0;
    }

    move(keys, currentTime) {
        const velocityX = (keys.right.isDown - keys.left.isDown) * this.speed;
        const velocityY = (keys.down.isDown - keys.up.isDown) * this.speed;

        const magnitude = Math.sqrt(velocityX ** 2 + velocityY ** 2);
        const normalizationFactor = magnitude > 0 ? this.speed / magnitude : 0;

        this.setVelocity(velocityX * normalizationFactor, velocityY * normalizationFactor);

        if (velocityX !== 0 || velocityY !== 0) {
            this.anims.play('walk-right', true); // Play walk-right animation for all directions
            if (velocityX < 0) {
                this.setFlipX(true); // Flip sprite for left movement
            } else if (velocityX > 0) {
                this.setFlipX(false); // Reset sprite flip for right movement
            }
        } else {
            this.anims.stop(); // Stop animation when idle
        }
    
        // Update last direction for potential other logic
        if (velocityX !== 0 || velocityY !== 0) {
            this.lastDirection = { x: velocityX, y: velocityY };
        }
    }

    // TODO(zach): Figure out how to make a working dash
    /*
    dash(currentTime) {
        const dashCooldown = 1000;
        const dashDuration = 200;
        const dashSpeedMultiplier = 3;

        if (this.isDashing || currentTime - this.lastDashTime < dashCooldown) {
            return;
        }

        this.isDashing = true;
        this.lastDashTime = currentTime;

        const dashVelocityX = this.lastDirection.x * dashSpeedMultiplier;
        const dashVelocityY = this.lastDirection.y * dashSpeedMultiplier;

        this.setVelocity(dashVelocityX, dashVelocityY);

        this.scene.time.delayedCall(dashDuration, () => {
            this.isDashing = false;
        });
    }
    */

    autoFire(enemies, fireballs, currentTime) {

        if (currentTime - this.lastFireTime < this.fireRate) {
            return;
        }
        this.lastFireTime = currentTime;

        const closestEnemy = this.getClosestEnemy(enemies);
        if (!closestEnemy) {
            return;
        }

        const direction = {
            x: closestEnemy.x - this.x,
            y: closestEnemy.y - this.y,
        };

        const fireball = fireballs.get(this.x, this.y, 'fireball');
        if (fireball) {
            fireball.fire(this.x, this.y, direction);
        }
    }

    getClosestEnemy(enemies) {
        let closestEnemy = null;
        let shortestDistance = Infinity;

        enemies.children.iterate((enemy) => {
            if (enemy.active) {
                const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    closestEnemy = enemy;
                }
            }
        });

        return closestEnemy;
    }
}
