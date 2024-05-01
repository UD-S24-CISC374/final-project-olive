import Phaser from "phaser";
import { terminalCommandInterface } from "../interfaces/terminalCommandInterface";
import { CharacterManager } from "../objects/CharacterManager";

export class terminalCommands {
    public characterManager: CharacterManager;
    private yCoords = [320, 360, 400, 440, 485, 520, 560];
    private xCoords = [600, 700, 800];
    constructor() {
        this.characterManager = new CharacterManager();
    }

    handleConsoleText = (
        text: string,
        curDir: string,
        consoleDialogue?: Phaser.GameObjects.Text
    ): terminalCommandInterface => {
        if (text === "cd .") {
            consoleDialogue?.setText("");
            curDir === "";
        }
        // tutorial
        if (text === "ls" && curDir === "") {
            consoleDialogue?.setText("HiddenTexts  Troops");
        }
        if (text === "cd HiddenTexts") {
            consoleDialogue?.setText("");
            curDir = "HiddenTexts";
        }
        if (text === "ls" && curDir === "HiddenTexts") {
            consoleDialogue?.setText("README");
        }
        if (text === "nano" && curDir === "HiddenTexts") {
            consoleDialogue?.setText("");
        }
        if (text === "cd .." && curDir === "HiddenTexts") {
            consoleDialogue?.setText("");
            curDir = "";
        }
        // main game
        // getting to the solider and back
        if (text === "ls" && curDir === "Troops") {
            consoleDialogue?.setText("Physical  Magic");
        }
        if (text === "cd Physical" && curDir === "Troops") {
            consoleDialogue?.setText("");
            curDir = "Troops";
        }
        if (text === "ls" && curDir === "Troops") {
            consoleDialogue?.setText("Soldier Ranger");
        }
        if (text === "mv Solider" && curDir === "Physical") {
            //set button to be visible
        }
        if (text === "cd .." && curDir === "Physical") {
            curDir = "Troops";
        }
        if (text === "cd .." && curDir == "Troops") {
            curDir = "";
        }
        // getting to the ranger and back
        if (text === "ls" && curDir === "Troops") {
            consoleDialogue?.setText("Physical  Magic");
        }
        if (text === "cd Physical" && curDir === "Troops") {
            consoleDialogue?.setText("");
            curDir = "Troops";
        }
        if (text === "ls" && curDir === "Physical") {
            consoleDialogue?.setText("Solider  Ranger");
        }
        if (text === "mv Ranger" && curDir === "Physical") {
            //set button to be visible
        }
        //getting to the mage and back
        if (text === "ls" && curDir === "Troops") {
            consoleDialogue?.setText("Physical  Magic");
        }
        if (text === "cd Magic" && curDir === "Troops") {
            consoleDialogue?.setText("Wizard");
            curDir = "Magic";
        }
        if (text === "ls" && curDir === "Magic") {
            consoleDialogue?.setText("Wizard");
        }
        if (text === "mv Wizard" && curDir === "Magic") {
            //set button to be visible
        }
        if (text === "cd .." && curDir === "Magic") {
            curDir = "Troops";
        }
        if (text === "cd .." && curDir == "Troops") {
            curDir = "";
        }
        return {
            text,
            curDir,
            consoleDialogue,
        };
    };
}
