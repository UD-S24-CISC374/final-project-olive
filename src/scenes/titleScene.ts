import Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {
    menuMusic: Phaser.Sound.BaseSound;
    constructor() {
        super({ key: "TitleScene" });
    }

    preload() {
        this.load.image("background", "assets/img/dnd_titlescreen1.png");
        this.load.image("play_button", "assets/img/play_button.png");
        this.load.image("tutorial_icon", "assets/img/tutorial_icon.png");
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        this.menuMusic = this.sound.add("titleScreenMusic");
        this.menuMusic.play({ volume: 0.4, loop: true });

        const background = this.add.image(0, 0, "background").setOrigin(0, 0);
        const scaleX = this.cameras.main.width / background.width;
        const scaleY = this.cameras.main.height / background.height;
        const maxScale = Math.max(scaleX, scaleY);
        background.setScale(maxScale).setScrollFactor(0);
        let title = this.add.text(centerX - 200, centerY, "Terminal Tactics");
        title.setFontSize(50);

        let playButton = this.add
            .image(centerX, centerY + 50, "play_button")
            .setInteractive();

        playButton.on("pointerover", () => {
            playButton.setScale(1.1);
        });

        playButton.on("pointerout", () => {
            playButton.setScale(1);
        });

        playButton.on("pointerup", () => {
            this.menuMusic.stop();
            this.scene.start("MainScene");
        });

        let tutorialButton = this.add
            .image(centerX, centerY + 100, "tutorial_icon")
            .setInteractive()
            .setScale(0.2);

        tutorialButton.on("pointerover", () => {
            tutorialButton.setScale(0.25);
        });

        tutorialButton.on("pointerout", () => {
            tutorialButton.setScale(0.2);
        });

        tutorialButton.on("pointerup", () => {
            this.menuMusic.stop();
            this.scene.start("TutorialScene");
        });
    }
}
