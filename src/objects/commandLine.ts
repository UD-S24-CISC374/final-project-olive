// CommandLine.ts
import Phaser from "phaser";
import { FolderSystem } from "../objects/folderSystem";
import { CharacterManager } from "../objects/CharacterManager";
import MainScene from "../scenes/mainScene";
import { WaveManager } from "./waveManager";

export class CommandLine {
    folderSystem: FolderSystem;
    private outputText: Phaser.GameObjects.Text;
    private prompt: string = "$ ";
    characterManager: CharacterManager;
    mainScene: MainScene;
    private inputBox: HTMLInputElement;
    waveManager: WaveManager;

    constructor(
        scene: MainScene,
        characterManager: CharacterManager,
        waveManager: WaveManager
    ) {
        this.folderSystem = new FolderSystem();
        this.characterManager = characterManager;
        this.mainScene = scene;
        this.waveManager = waveManager;
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
            case "startwave":
                // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
                output = this.waveManager.startNextWave();
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

        if (characterPrice > this.mainScene.currency) {
            return `Insufficient currency to purchase ${characterName}`;
        }

        const coordsToBoard = this.mainScene.board_map.getCellPosition(x, y);

        if (
            !this.mainScene.board_map.isWithinBounds(
                coordsToBoard.x,
                coordsToBoard.y
            )
        ) {
            return `Invalid coordinates (${x}, ${y})`;
        }

        //create statement that wont allow purchase if another char in same position
        if (this.characterManager.sameCoord(coordsToBoard.x, coordsToBoard.y)) {
            return `Another character is already in the position (${x}, ${y})`;
        }

        const gameCharacter = this.folderSystem.createCharacter(
            characterName,
            this.mainScene,
            coordsToBoard.x,
            coordsToBoard.y
        );

        if (!gameCharacter) {
            return `Failed to instantiate ${characterName}`;
        }
        this.mainScene.increaseCurrency(-characterPrice);
        this.characterManager.addCharacter(gameCharacter);

        return `Purchased ${characterName} for ${characterPrice} and placed it at (${x}, ${y})`;
    }

    private removeCharacter(
        characterName: string,
        x: number,
        y: number
    ): string {
        if (isNaN(x) || isNaN(y)) {
            return `Invalid coordinates. Usage: remove <characterName> <x> <y>`;
        }
        const coordsToBoard = this.mainScene.board_map.getCellPosition(x, y);

        if (
            !this.mainScene.board_map.isWithinBounds(
                coordsToBoard.x,
                coordsToBoard.y
            )
        ) {
            return `Invalid coordinates (${x}, ${y})`;
        }

        if (
            this.characterManager.removeCharacterByNameAndPosition(
                characterName,
                coordsToBoard.x,
                coordsToBoard.y
            )
        ) {
            return `Removed ${characterName} at position (${x}, ${y})`;
        }

        return `Character not found: ${characterName} at (${x}, ${y})`;
    }

    private updateOutputText(output: string) {
        this.mainScene.updateOutputText(output);
    }
}
