import Phaser from "phaser";
import { GameCharacter } from "./GameCharacter";
import { Projectile } from "./Projectile";
import MainScene from "../scenes/mainScene";

export class Zombie extends GameCharacter {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, "Zombie", 50, x, y, "zombieTexture", 0, 10);
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
    takeDamage(damage: number): void {
        this.health -= damage;
        if (this.health <= 0) {
            this.alive = false;
            this.dropCurrency(); // Drop currency when the zombie dies
            (this.scene as MainScene).characterManager.removeCharacter(this);
        }
        console.log(`${this.name} is taking damage.`);
    }

    private dropCurrency() {
        const scene = this.scene as MainScene;
        const currencyDrop = 5; // Fixed amount of currency to drop
        scene.increaseCurrency(currencyDrop);
    }
}
