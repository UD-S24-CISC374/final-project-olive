// CommandLine.ts
import Phaser from "phaser";
import { FolderSystem } from "./folderSystem";
import { CharacterManager } from "../objects/CharacterManager";
//import MainScene from "../scenes/mainScene";
import { GameCharacter } from "../objects/GameCharacter";
import MainScene from "../scenes/mainScene";

export class CommandLine {
    private folderSystem: FolderSystem;
    private outputText: Phaser.GameObjects.Text;
    private prompt: string = "$ ";
    private characterManager: CharacterManager;
    private currency: number;
    private mainScene: MainScene;
    private inputBox: HTMLInputElement;

    constructor(
        scene: MainScene,
        characterManager: CharacterManager,
        currency: number
    ) {
        this.folderSystem = new FolderSystem();
        this.characterManager = characterManager;
        this.currency = currency;
        this.mainScene = scene;
    }

    public processCommand(command: string) {
        const tokens = command.split(" ");
        const mainCommand = tokens[0];
        const arg1 = tokens[1] ?? "";
        const arg2 = parseFloat(tokens[2] ?? "");
        const arg3 = parseFloat(tokens[3] ?? "");

        let output = "";

        switch (mainCommand) {
            case "cd":
                output = this.folderSystem.changeDirectory(arg1);
                break;
            case "ls":
                output = this.folderSystem.listContents();
                break;
            case "purchase":
                output = this.purchaseCharacter(arg1, arg2, arg3);
                break;
            case "remove":
                output = this.removeCharacter(arg1, arg2, arg3);
                break;
            default:
                output = `Invalid command: ${command}`;
                break;
        }

        this.updateOutputText(output);
    }

    private purchaseCharacter(
        characterName: string,
        x: number,
        y: number
    ): string {
        if (isNaN(x) || isNaN(y)) {
            return `Invalid coordinates. Usage: purchase <characterName> <x> <y>`;
        }

        const characterPrice = this.folderSystem
            .getRootFolder()
            .children?.find((folder) => folder.name === "characters")
            ?.children?.find(
                (character) => character.name === characterName
            )?.price;

        if (!characterPrice) {
            return `Character not found: ${characterName}`;
        }

        if (characterPrice > this.currency) {
            return `Insufficient currency to purchase ${characterName}`;
        }

        const gameCharacter = this.folderSystem.createCharacter(
            characterName,
            this.mainScene,
            x,
            y
        );

        if (!gameCharacter) {
            return `Failed to instantiate ${characterName}`;
        }

        this.currency -= characterPrice;
        this.mainScene.increaseCurrency(-characterPrice);
        this.characterManager.addCharacter(gameCharacter);
        return `Purchased ${characterName} for ${characterPrice}`;
    }

    private removeCharacter(
        characterName: string,
        x: number,
        y: number
    ): string {
        if (isNaN(x) || isNaN(y)) {
            return `Invalid coordinates. Usage: remove <characterName> <x> <y>`;
        }

        const character = Array.from(this.characterManager.characters).find(
            (char) => {
                const gameChar = char as GameCharacter;
                return (
                    gameChar.name === characterName &&
                    Math.abs(gameChar.x - x) < 1 &&
                    Math.abs(gameChar.y - y) < 1
                );
            }
        );

        if (character) {
            this.characterManager.removeCharacter(character);
            return `Removed ${characterName} at (${x}, ${y})`;
        }

        return `Character not found: ${characterName} at (${x}, ${y})`;
    }

    private updateOutputText(output: string) {
        this.mainScene.updateOutputText(output);
    }
}
