import { Directories } from "../interfaces/directories";
import Phaser from "phaser";

export class instruction {
    constructor() {}

    public handleInstruction(
        lsTut: boolean,
        cdTut: boolean,
        cdLsTut: boolean,
        cdBackTut: boolean,
        curDir: string | undefined,
        dialogue?: Phaser.GameObjects.Text | undefined
    ): Directories {
        // Display textbox as commands are entered
        dialogue?.setText(
            "Welcome General, we must defend the castle!\nUse the spell ls to find your allies"
        );
        if (lsTut) {
            dialogue?.setText(
                "ls is used to list out all the contents in a given directory.\nSpeaking of directories type cd HiddenText"
            );
            curDir = "HiddenText";
        }
        if (cdTut) {
            dialogue?.setText(
                "Using cd allows you to change the directory you are looking at\nNow using what you just learned see whats in this folder"
            );
        }
        if (cdLsTut) {
            dialogue?.setText(
                "Well done General, time to get back to the begining.\nType cd.."
            );
        }
        if (cdBackTut) {
            dialogue?.setText(
                "Great now there is one last spell which will be used later to place your troops.\nYou will use mv to place your troops"
            );
            curDir = "";
        }
        return {
            curDir,
            dialogue,
        };
    }
}
