export class BGMan {
    constructor(scene) {
        this.scene = scene;
        this.bgtile = null;
    }

    makeBackground(texture = 'bgTile') {
        this.bgtile = this.scene.add.tileSprite(
            this.scene.cameras.main.width / 2,  // Center the TileSprite horizontally
            this.scene.cameras.main.height / 2, // Center the TileSprite vertically
            this.scene.cameras.main.width,      // Match the camera width
            this.scene.cameras.main.height,     // Match the camera height
            texture                             // Background texture key
        );
        this.bgtile.setScrollFactor(0).setDepth(-1); // Background stays fixed and behind other objects
    }

    update(playerX, playerY) {
        this.bgtile.tilePositionX = playerX; // Scroll background horizontally
        this.bgtile.tilePositionY = playerY; // Scroll background vertically
    }
    
}