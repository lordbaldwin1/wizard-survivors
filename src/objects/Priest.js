import { Enemy } from "./Enemy";

export class Priest extends Enemy {
    constructor(scene, x, y, texture) {
        super(scene, x, y, 'priest');
        this.speed = 25; 
        //this.radius = 12
        //this.setSize(40, 40);
    }
}