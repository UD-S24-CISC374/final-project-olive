import Phaser from "phaser";
import { GameCharacter } from "./GameCharacter";

export class CharacterManager {
    characters = new Set<Phaser.GameObjects.GameObject>();

    addCharacter(character: Phaser.GameObjects.GameObject) {
        this.characters.add(character);
    }

    removeCharacter(character: Phaser.GameObjects.GameObject) {
        character.destroy();
        this.characters.delete(character);
    }

    update() {
        this.characters.forEach((character) => {
            if ("update" in character) {
                (character as GameCharacter).update();
            }
        });
    }
}
