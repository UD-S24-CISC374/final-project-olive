import Phaser from "phaser";
import { GameCharacter } from "./GameCharacter";
import { Projectile } from "./Projectile";

export class Zombie extends GameCharacter {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, "Zombie", 100, x, y, "zombieTexture", 100);
    }

    attack(): void {
        console.log(`${this.name} is attacking.`);
        //TODO:
        new Projectile(this.scene, this.x + 50, this.y, "zombieTexture");
    }
}
