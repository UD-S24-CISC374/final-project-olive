import Phaser from "phaser";
import { GameCharacter } from "./GameCharacter";

export class CharacterManager {
    characters = new Set<Phaser.GameObjects.GameObject>();

    addCharacter(character: Phaser.GameObjects.GameObject) {
        this.characters.add(character);
    }

    sameCoord(x: number, y: number): boolean {
        const foundCharacter = Array.from(this.characters).find((character) => {
            const gameChar = character as GameCharacter;
            return gameChar.x === x && gameChar.y === y;
        });
        if (foundCharacter) {
            return true;
        }

        return false;
    }

    removeCharacter(character: Phaser.GameObjects.GameObject) {
        character.destroy();
        this.characters.delete(character);
    }
    removeCharacterByNameAndPosition(
        name: string,
        x: number,
        y: number
    ): boolean {
        const characterToRemove = Array.from(this.characters).find(
            (character) => {
                const gameChar = character as GameCharacter;
                return (
                    gameChar.name === name &&
                    gameChar.x === x &&
                    gameChar.y === y
                );
            }
        );

        if (characterToRemove) {
            this.removeCharacter(characterToRemove);
            return true;
        }

        return false;
    }

    update() {
        this.characters.forEach((character) => {
            if ("update" in character) {
                (character as GameCharacter).update();
            }
        });
    }
}
