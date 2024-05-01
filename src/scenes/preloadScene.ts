import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        // this.load.image("background", "assets/img/trainGrounds.png");
        // this.load.image("sword", "assets/img/sword.png");
        // this.load.image("play_button", "assets/img/play_button.png");
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

    create() {
        this.scene.start("MainScene");
    }
}
