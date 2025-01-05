export class PlayerUI {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;

        this.healthBarHeight = 4;
        this.healthBarWidth = 48;
        this.hpBar = scene.add.graphics().setScrollFactor(0);
        this.healthBarOffset = new Phaser.Math.Vector2(
            this.scene.renderer.width * 0.5 - (this.healthBarWidth / 2),
            (this.scene.renderer.height * 0.5 - (this.healthBarHeight / 2)) + 25
        );
    }

    updateHealthBar() {
        let percentHealth = this.player.health / this.player.maxHealth;

        // Black background
        this.hpBar.fillStyle(0x000000, 1);
        this.hpBar.fillRect(this.healthBarOffset.x, this.healthBarOffset.y, this.healthBarWidth, this.healthBarHeight);

        // Red foreground
        this.hpBar.fillStyle(0xff0000, 1);
        this.hpBar.fillRect(this.healthBarOffset.x, this.healthBarOffset.y, this.healthBarWidth * percentHealth, this.healthBarHeight);
    }
}