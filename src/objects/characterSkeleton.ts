/*
import Phaser from "phaser";

abstract class GameCharacter {
  name: string;
  health: number;
  position: Phaser.Math.Vector2;
  alive: boolean;
  cost: number;

  constructor(name: string, health: number, position: Phaser.Math.Vector2, cost: number) {
    this.name = name;
    this.health = health;
    this.position = position;
    this.alive = true;
    this.cost = cost;
  }

  abstract attack(): void;

  // Method for the character to take damage. Reduces health and checks for death.
  takeDamage(damage: number): void {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.alive = false;
      this.remove();
    }
  }

  // Method to remove the character from the game, e.g., when health is 0.
  remove(): void {
    console.log(`${this.name} has been removed from the game.`);
  }
}
*/
