import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("phaser-logo", "assets/img/phaser-logo.png");
        this.load.image("grass", "assets/img/grass.png");
        this.load.image("trainGrounds", "assets/img/trainGrounds.png");
        this.load.image("dude", "assets/img/dude.png");
        this.load.image("finishLine", "assets/img/finishLine.png");
        this.load.image("platform", "assets/img/platform.png");
        this.load.image("button", "assets/img/button.jpg");
    }

    create() {
        this.scene.start("MainScene");
    }
}
