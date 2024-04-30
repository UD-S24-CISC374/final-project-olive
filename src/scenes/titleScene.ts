import Phaser from "phaser";
// import PhaserLogo from "../objects/phaserLogo";
// import FpsText from "../objects/fpsText";
// import { Zombie } from "../objects/ZombieChar"; // Assuming you have a Zombie class that extends GameCharacter
// import { Soldier } from "../objects/SoldierChar";
// import { Ranger } from "../objects/RangerChar";
// import { Projectile } from "../objects/Projectile";
// import { Soldier } from "../objects/SoldierChar";
// import { Wizard } from "../objects/WizardChar";
// import { CharacterManager } from "../objects/CharacterManager";
// import { GameCharacter } from "../objects/GameCharacter";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "TitleScene" });
    }

    create() {
        this.add.image(500, 500, "background");
        let hover = this.add.image(100, 100, "sword");
        let playButton = this.add.image(0, 0, "play_button");
        playButton.setInteractive();

        playButton.on("pointerover", () => {
            hover.setVisible(true);
            hover.x = playButton.x - playButton.width;
            hover.y = playButton.y;
        });
        playButton.on("pointerout", () => {
            hover.setVisible(false);
        });
        playButton.on("pointerup", () => {
            this.scene.start("MainScene");
        });
    }

    update() {}
    preload() {
        this.load.image("phaser-logo", "assets/img/phaser-logo.png");
        this.load.image("grass", "assets/img/grass.png");
        this.load.image("trainGrounds", "assets/img/trainGrounds.png");
        this.load.image("dude", "assets/img/dude.png");
        this.load.image("finishLine", "assets/img/finishLine.png");
        this.load.image("platform", "assets/img/platform.png");
        this.load.image("button", "assets/img/button.jpg");
        this.load.image("rangerTexture", "assets/img/ranger-small.png");
        this.load.image("soldierTexture", "assets/img/soldier-small.png");
        this.load.image("zombieTexture", "assets/img/zombie-small.png");
        this.load.image("arrowTexture", "assets/img/arrow-small.png");
        this.load.image("wizardTexture", "assets/img/wizard-small.png");
    }
}
