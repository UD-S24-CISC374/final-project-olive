import Phaser from "phaser";

export class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update(): void {
        if (this.x > this.scene.sys.canvas.width) {
            this.destroy(); // Remove the projectile if it goes off screen
        }
    }
}
