import Phaser from "phaser";

export interface terminalCommandInterface {
    text: string;
    curDir: string;
    consoleDialogue?: Phaser.GameObjects.Text;
}
