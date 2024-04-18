import Phaser from "phaser";

export class Projectile extends Phaser.Physics.Arcade.Sprite {
    damage: number;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        damage: number
    ) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.damage = damage;
    }

    update(): void {
        if (this.x > this.scene.sys.canvas.width) {
            this.destroy(); // Remove the projectile if it goes off screen
        }
    }
}
