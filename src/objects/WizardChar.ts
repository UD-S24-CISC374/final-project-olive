import Phaser from "phaser";
import { GameCharacter } from "./GameCharacter";
import { Projectile } from "./Projectile";
import MainScene from "../scenes/mainScene";

export class Wizard extends GameCharacter {
    static cost = 70;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, "wizard", 120, x, y, "wizardTexture", 30, 20);
    }

    attack(): void {
        console.log(`${this.name} is attacking.`);
        let projectile = new Projectile(
            this.scene,
            this.x,
            this.y,
            "energyBallTexture",
            this.dmg
        );
        projectile.body?.setSize(40, 10);
        (this.scene as MainScene).projectiles?.add(projectile); // Cast to MainScene to access projectiles
    }
}
