export class EnemyPool extends Phaser.GameObjects.Group {
    constructor(scene, enemyConfigs, maxSize = 300) {
        this.scene = scene;
        this.enemyConfigs = enemyConfigs // enemyType?
        this.maxSize = maxSize;
        this.pool = [];

        this.fillPool(enemyConfigs[0].key)
    }

    fillPool(enemyKey) {
        while (this.pool.length < this.maxSize) {
            const enemy = this.createEnemy(enemyKey);
            this.pool.push(enemy);
        }
    }

    createEnemy(key) {
        const enemy = this.scene.physics.add.sprite(0, 0, key);
        enemy.setActive(false);
        enemy.setVisible(false);
        return enemy;
    }

    getEnemy(currentGameTime) {
        const enemyType = this.getEnemyType(currentGameTime);
        let enemy = this.pool.find(e => !e.active && e.texture.key === enemyType.key);

        if (!enemy) {
            enemy = this.createEnemy(enemyType.key);
            this.pool.push(enemy);
        }

        enemy.setActive(true);
        enemy.setVisible(true);
        enemy.type = enemyType;
        return enemy;
    }

    getEnemyType(gameTime) {
        return this.enemyConfigs.find(config => gameTime >= config.startTime) || this.enemyConfigs[0];
    }

    releaseEnemy(enemy) {
        enemy.setActive(false);
        enemy.setVisible(false);
        enemy.body.reset(0, 0);
    }
}

const enemyConfigs = [
    { key: 'priest', startTime: 0 },  // Default enemy
    { key: 'priest', startTime: 30 }, // Spawns after 30 seconds
    { key: 'priest', startTime: 60 }, // Spawns after 60 seconds
];