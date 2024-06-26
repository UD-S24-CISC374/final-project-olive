import Phaser from "phaser";
import { GameCharacter } from "./GameCharacter";
import { Projectile } from "./Projectile";
import MainScene from "../scenes/mainScene";

export class Ranger extends GameCharacter {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, "ranger", 100, x, y, "rangerTexture", 30, 50);
    }

    attack(): void {
        console.log(`${this.name} is attacking.`);
        let projectile = new Projectile(
            this.scene,
            this.x,
            this.y,
            "arrowTexture",
            this.dmg
        );
        projectile.body?.setSize(40, 10);
        (this.scene as MainScene).projectiles?.add(projectile); // Cast to MainScene to access projectiles
    }
}
