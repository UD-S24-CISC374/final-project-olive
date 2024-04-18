import Phaser from "phaser";
import MainScene from "../scenes/mainScene";

export abstract class GameCharacter extends Phaser.Physics.Arcade.Sprite {
    name: string;
    health: number;
    position: Phaser.Math.Vector2;
    alive: boolean;
    cost: number;
    dmg: number;

    constructor(
        scene: Phaser.Scene,
        name: string,
        health: number,
        x: number,
        y: number,
        texture: string,
        cost: number,
        dmg: number
    ) {
        super(scene, x, y, texture); // Call the super constructor with necessary parameters
        this.scene.add.existing(this); // Add this sprite to the scene
        this.name = name;
        this.health = health;
        this.position = new Phaser.Math.Vector2(x, y);
        this.alive = true;
        this.cost = cost;
        scene.physics.add.existing(this);
        this.setOrigin(0.5, 0.5); // Set the origin of the sprite
        this.dmg = dmg;
    }

    abstract attack(): void;

    // Method for the character to take damage. Reduces health and checks for death.
    takeDamage(damage: number): void {
        this.health -= damage;
        if (this.health <= 0) {
            this.alive = false;
            (this.scene as MainScene).characterManager.removeCharacter(this);
        }
        console.log(`${this.name} is taking damage.`);
    }

    // Method to remove the character from the game, e.g., when health is 0.
    remove(): void {
        this.destroy(); // Just destroy this sprite
        console.log(`${this.name} has been removed from the game.`);
    }
}
