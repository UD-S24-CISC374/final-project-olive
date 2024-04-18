import Phaser from "phaser";
import { GameCharacter } from "./GameCharacter";
import { Projectile } from "./Projectile";
import MainScene from "../scenes/mainScene";

export class Wizard extends GameCharacter {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, "Wizard", 120, x, y, "wizardTexture", 100, 20);
    }

    attack(): void {
        console.log(`${this.name} is attacking.`);
        let projectile = new Projectile(
            this.scene,
            this.x + 50,
            this.y,
            "arrowTexture",
            this.dmg
        );
        projectile.body?.setSize(40, 10);
        (this.scene as MainScene).projectiles?.add(projectile); // Cast to MainScene to access projectiles
    }
}
