import { Enemy } from './Enemy';

export class EnemyGroup extends Phaser.GameObjects.Group {
    constructor(scene, enemyType) {
        super(scene);

        this.scene.add.existing(this);
        
        this.enemyType = enemyType;
        this.stored = [];
        this.spawned = [];
    }
  
    spawn(x, y) {
        let enemy = this.stored.pop();
        if (!enemy) {
            enemy = new Enemy(this.scene, 0, 0, this.enemyType);
        }
        this.scene.children.add(enemy);
        enemy.init(x, y);
        this.add(enemy, true);
        this.spawned.push(enemy);
        return enemy;
    }
  
    recycle(enemy) {
        this.scene.children.remove(enemy);
        this.remove(enemy, true, false);
        this.stored.push(enemy);
    }
  
    update(player) {
        this.spawned.forEach((enemy) => {
            if (enemy.active) enemy.update(player);
        });
    }
  }
  