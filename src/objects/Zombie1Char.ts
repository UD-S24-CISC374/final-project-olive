import Phaser from "phaser";
import MainScene from "../scenes/mainScene";
import { BaddyCharacter } from "./baddyCharacter";

export class Zombie1 extends BaddyCharacter {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, "Zombie1", 50, x, y, "zombieTexture", 10, 1);
    }

    attack(): void {
        console.log(`${this.name} attacked base.`);
    }
    takeDamage(damage: number): void {
        this.health -= damage;
        if (this.health <= 0) {
            this.alive = false;
            this.dropCurrency(); // Drop currency when the zombie dies
            (this.scene as MainScene).baddiesManager.removeCharacter(
                "Zombie1",
                this
            );
        }
        console.log(`${this.name} is taking damage.`);
    }

    dropCurrency() {
        const scene = this.scene as MainScene;
        const currencyDrop = 5; // Fixed amount of currency to drop
        scene.increaseCurrency(currencyDrop);
    }
}
