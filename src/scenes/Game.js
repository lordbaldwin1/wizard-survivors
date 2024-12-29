import { Player } from '../objects/Player';
import { Skeleton } from '../objects/Skeleton';
import { Fireball } from '../objects/Fireball';
import { DarkWizard } from '../objects/DarkWizard';
import { Chunk } from '../objects/Entities';

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create() {
        // Map
        /* OG MAP
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('mountain', 'mountain');
        const groundLayer = map.createLayer('Tile Layer 1', tileset, 0, 0);
        groundLayer.setCollisionByProperty({ collides: true });
        */

        // Player creation
        this.player = new Player(this, 512, 384, 'player');
        this.cameras.main.startFollow(this.player);
      
        this.chunkSize = 16;
        this.tileSize = 16;
        this.chunks = [];

        /* OG CAMERA
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // Camera bounds
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // World bounds
        */

        // Base enemies group
        this.enemies = this.physics.add.group({
            runChildUpdate: true, // Automatically update children
        });
    
        // Add skeletons to the enemies group
        this.skeletons = this.physics.add.group({
            classType: Skeleton,
            runChildUpdate: true,
        });
        this.enemies.add(this.skeletons.get(212, 212, 'skeleton-head'));
        this.enemies.add(this.skeletons.get(800, 800, 'skeleton-head'));
    
        // Add dark wizards to the enemies group
        this.darkwizards = this.physics.add.group({
            classType: DarkWizard,
            runChildUpdate: true,
        });
        this.enemies.add(this.darkwizards.get(800, 100, 'dark-wizard'));

        // Add fireballs
        this.fireballs = this.physics.add.group({
            classType: Fireball,
            runChildUpdate: true,
        });
        this.physics.add.overlap(this.fireballs, this.enemies, this.hitEnemy, null, this);
        this.time.addEvent({
            delay: 500,
            callback: this.autoFire,
            callbackScope: this,
            loop: true,
        })

        // Keyboard input
        this.keys = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };
    }

    getChunk(x, y) {
        var chunk = null;
        for (var i = 0; i < this.chunks.length; i++) {
          if (this.chunks[i].x == x && this.chunks[i].y == y) {
            chunk = this.chunks[i];
          }
        }
        return chunk;
      }

    update(time) {
        this.player.move(this.keys, time);
        // Dynamic Chunk Loading/Unloading
        var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.player.x / (this.chunkSize * this.tileSize));
        var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.player.y / (this.chunkSize * this.tileSize));
    
        snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
        snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;
    
        for (var x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
          for (var y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
            var existingChunk = this.getChunk(x, y);
    
            if (existingChunk == null) {
              var newChunk = new Chunk(this, x, y);
              this.chunks.push(newChunk);
            }
          }
        }
    
        for (var i = 0; i < this.chunks.length; i++) {
          var chunk = this.chunks[i];
    
          if (Phaser.Math.Distance.Between(
            snappedChunkX,
            snappedChunkY,
            chunk.x,
            chunk.y
          ) < 3) {
            if (chunk !== null) {
              chunk.load();
            }
          }
          else {
            if (chunk !== null) {
              chunk.unload();
            }
          }
        }

        this.player.autoFire(this.enemies, this.fireballs, time);

        this.skeletons.children.iterate((skeleton) => {
            if (skeleton.active) {
                skeleton.chaseTarget(this.player);
            }
        });

        this.darkwizards.children.iterate((darkwizard) => {
            if (darkwizard.active) {
                darkwizard.chaseTarget(this.player);
            }
        });
    }

    hitEnemy(fireball, enemy) {
        fireball.destroy();

        if (enemy instanceof Skeleton || enemy instanceof DarkWizard) {
            enemy.takeDamage(50);
        }
    }
}
