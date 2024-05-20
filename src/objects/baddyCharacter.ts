import Phaser from "phaser";
import { GameCharacter } from "./GameCharacter";

export abstract class BaddyCharacter extends GameCharacter {
    difficulty: number;
    constructor(
        scene: Phaser.Scene,
        name: string,
        health: number,
        x: number,
        y: number,
        texture: string,
        dmg: number,
        difficulty: number
    ) {
        super(scene, name, health, x, y, texture, 0, dmg);
        this.difficulty = difficulty;
    }

    abstract dropCurrency(): void;
}
