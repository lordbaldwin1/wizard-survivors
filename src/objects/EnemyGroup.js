export class EnemyGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene, config, maxSize = 30) {
        super(scene.physics.world, scene);

        this.scene = scene;
        this.maxSize = maxSize;

        this.recycleRadius = 500;

        this.createMultiple({
            key: 'enemy',
            quantity: this.maxSize,
            active: false,
            visible: false,
            classType: Enemy,
            createCallback: (enemy) => {
                enemy.body.setEnable(false);
            },
        });
    }

    spawn(x, y) {
        const enemy = this.getFirstDead(false);

        if (enemy) {
            enemy.setActive(true);
            enemy.setVisible(true);
            enemy.setPosition(x, y);
            enemy.body.setEnable(true);
        }
        return enemy;
    }

    despawn (enemy) {
        if (enemy) {
            enemy.setActive(false);
            enemy.setVisible(false);
            enemy.body.setEnable(false);
        }
    }

    recycle(enemy, x, y) {
        console.log("Enemy Recycled");
        enemy.setActive(false);
        enemy.setVisible(false);
        enemy.body.setEnable(false);

        this.spawn(x, y);
    }

    update(player, rectInner, rectOuter) {
        this.children.iterate((enemy) => {
            if (enemy.active) {
                const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);

                if (distance > this.recycleRadius) {
                    const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(rectOuter, rectInner);
                    this.recycle(enemy, spawnPoint.x, spawnPoint.y);
                }
                enemy.update(player);
            }
        });
    }
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'priest');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCircle(12);
        this.speed = 25;
    }

    update(player) {
        this.scene.physics.moveToObject(this, player, this.speed);
    }
}