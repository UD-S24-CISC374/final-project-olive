import Phaser from "phaser";
import { GameCharacter } from "./GameCharacter";
import { Projectile } from "./Projectile";

export class Soldier extends GameCharacter {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, "Soldier", 120, x, y, "soldierTexture", 100);
    }

    attack(): void {
        console.log(`${this.name} is attacking.`);
        //TODO:
        // Implement attack logic specific to ranger
        new Projectile(this.scene, this.x + 50, this.y, "arrowTexture");
    }
}
