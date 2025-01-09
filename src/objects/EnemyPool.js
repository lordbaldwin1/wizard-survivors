import { Enemy } from '../objects/Enemy';

export class EnemyPool extends Phaser.GameObjects.Group {
    constructor(scene, enemyConfigs, maxSize = 5) {
        super(scene); // Call the Phaser.GameObjects.Group constructor
        this.scene = scene;
        this.enemyConfigs = enemyConfigs;
        this.maxSize = maxSize;

        // Create the initial pool for the first enemy type
        this.createPool(this.enemyConfigs[0]);
    }

    createPool(config) {
        for (let i = 0; i < this.maxSize; i++) {
            const enemy = new Enemy(this.scene, 0, 0, config.key);
            enemy.setActive(false);
            enemy.setVisible(false);
            this.add(enemy); // Add the enemy to the group
        }
    }

    // Get an enemy (recycles or creates a new one if necessary)
    getEnemy(gameTime, x, y) {
        const config = this.getEnemyType(gameTime);
        let enemy = this.getFirstDead(false); // Get an inactive enemy

        if (!enemy) {
            console.log("No enemy from getFirstDead, creating new one...");
            return null;
        }

        // Initialize and return the enemy
        enemy.spawn(x, y, config);
        return enemy;
    }

    // Determine the type of enemy based on game time
    getEnemyType(gameTime) {
        return this.enemyConfigs.find(config => gameTime >= config.startTime) || this.enemyConfigs[0];
    }
}
