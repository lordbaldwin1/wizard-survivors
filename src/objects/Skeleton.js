import { Enemy } from './Enemy';

export class Skeleton extends Enemy {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // Skeleton-specific properties
        this.health = 100; // Skeleton has more health
        this.speed = 100;  // Skeleton moves slower
        this.setSize(40, 40);
    }

    // Skeleton-specific behavior can be added here
}