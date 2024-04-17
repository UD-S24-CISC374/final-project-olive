import Phaser from "phaser";
import { GameCharacter } from "./GameCharacter";
import { Projectile } from "./Projectile";
import MainScene from "../scenes/mainScene";

export class Ranger extends GameCharacter {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, "Ranger", 120, x, y, "rangerTexture", 100);
    }

    attack(): void {
        console.log(`${this.name} is attacking.`);
        //TODO:
        // Implement attack logic specific to ranger
        let projectile = new Projectile(
            this.scene,
            this.x + 50,
            this.y,
            "arrowTexture"
        );
        projectile.body?.setSize(40, 10);
        (this.scene as MainScene).projectiles?.add(projectile); // Cast to MainScene to access projectiles
    }
}