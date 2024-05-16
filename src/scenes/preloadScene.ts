import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        //images
        this.load.image("phaser-logo", "assets/img/phaser-logo.png");
        this.load.image("grass", "assets/img/grass-sm.png");
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
        this.load.image("tree", "assets/img/tree.png");
        this.load.image("fort", "assets/img/file.jpg");
        this.load.image("left-trees", "assets/img/left-trees.jpg");
        this.load.image("right-trees", "assets/img/right-trees.jpg");
        this.load.image("map", "assets/img/map1.png");
        this.load.image("energyBallTexture", "assets/img/energy-ball-sm.png");
        this.load.image("fireBallTexture", "assets/img/fire-ball-sm.png");
        this.load.image("youLose", "assets/img/youLose.jpeg");
        this.load.image("youWin", "assets/img/youWin.jpeg");
        this.load.image("questionMark", "assets/img/questionMark.png");
        this.load.image("wizardNPC", "assets/img/wizardNPC.jpg");
        this.load.image("titlePage", "assets/img/titlePage.jpeg");

        //audio
        this.load.audio("backgroundMusic", "assets/audio/backgroundMusic.mp3");
        this.load.audio("tutorialMusic", "assets/audio/tutorialMusic.mp3");
        this.load.audio("endGameMusic", "assets/audio/endGameMusic.mp3");
        this.load.audio("victoryMusic", "assets/audio/victoryMusic.mp3");
        this.load.audio("defeatMusic", "assets/audio/defeatMusic.mp3");
        this.load.audio(
            "titleScreenMusic",
            "assets/audio/titleScreenMusic.mp3"
        );
    }

    create() {
        this.scene.start("TitleScene");
    }
}
