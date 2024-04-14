import Phaser from "phaser";
//import PhaserLogo from "../objects/phaserLogo";
import FpsText from "../objects/fpsText";

export default class MainScene extends Phaser.Scene {
    private edge: Phaser.Physics.Arcade.StaticGroup;
    private grunts?: Phaser.Physics.Arcade.Group;
    fpsText: FpsText;
    private gameOver = false;
    private gruntAmount = 2;
    private currentWave = 0;
    private maxWave = 2;
    private score = 0;
    private scoreText: Phaser.GameObjects.Text;
    private end: Phaser.Physics.Arcade.StaticGroup;
    private finish: Phaser.Physics.Arcade.StaticGroup;
    private yCoords = [275, 325, 360, 445, 525];

    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        this.add.image(700, 400, "grass");
        this.add.image(1100, 400, "grass");
        let ground = this.add.image(5, 300, "trainGrounds");
        ground.flipX = true;

        //this.edge.create(0, 0, "finishLine");
        this.edge = this.physics.add.staticGroup();
        let platform = this.edge.create(
            525,
            400,
            "platform"
        ) as Phaser.Physics.Arcade.Sprite;
        platform.angle = 90;
        platform.setInteractive();

        this.grunts = this.physics.add.group({
            key: "enemyGrunt",
            repeat: this.gruntAmount - 1,
            setXY: { x: 1100, y: 525, stepX: 60 },
        });
        this.grunts.children.iterate((child) => {
            const c = child as Phaser.Physics.Arcade.Sprite;
            const randomIndex = Phaser.Math.Between(0, this.yCoords.length - 1);
            c.setY(this.yCoords[randomIndex]);
            return true;
        });
        this.grunts.children.iterate((child) => {
            const c = child as Phaser.Physics.Arcade.Sprite;
            console.log("run: " + c.name);
            c.setVelocityX(Phaser.Math.FloatBetween(-50, -10));
            return true;
        });

        this.physics.add.collider(
            this.grunts,
            this.edge,
            this.handleHitWall,
            undefined,
            this
        );

        //new PhaserLogo(this, this.cameras.main.width / 2, 0);
        this.fpsText = new FpsText(this);

        const message = `Phaser v${Phaser.VERSION}`;
        this.add
            .text(this.cameras.main.width - 15, 15, message, {
                color: "#000000",
                fontSize: "24px",
            })
            .setOrigin(1, 0);
        const button = this.add.image(200, 700, "button").setInteractive();
        button.on("pointerup", () => {
            this.add.text(
                300,
                400,
                "when this button is pushed it will display the book of allies",
                {
                    fontSize: "20px",
                    color: "black",
                }
            );
        });
        this.score = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let scoreText = this.add.text(15, 50, "Score: 0", {
            fontSize: "20px",
            color: "black",
        });
    }

    private enemyHitWall() {
        console.log("hit wall enemy");
    }
    private handleHitWall() {
        this.physics.pause();
        this.grunts?.remove;
        this.gameOver = true;
    }

    update() {
        this.fpsText.update();
        if (this.gruntAmount === 0) {
            if (this.currentWave === this.maxWave) {
                //If we're on wave 3 (max) and gruntAmount is zero, that means the player has defeated all waves
                //this.victoryText.visible = true;
                this.gameOver = true;
            } else {
                this.currentWave += 1; //Increment the wave amount to make more baddies spawn
                this.gruntAmount = this.currentWave * 2;
                this.grunts?.createMultiple({
                    key: "gruntKey",
                    repeat: this.gruntAmount - 1,
                    setXY: { x: 60, y: 0, stepX: 60 },
                });
                this.grunts?.children.iterate((child) => {
                    const c = child as Phaser.Physics.Arcade.Sprite;
                    c.setVelocity(0, Phaser.Math.FloatBetween(-50, -10));
                    return true;
                });
            }
        }

        this.grunts?.children.iterate((child, idx) => {
            const c = child as Phaser.Physics.Arcade.Sprite;

            if (c.x <= 475) {
                console.log(idx + ":x:" + c.x + "y: " + c.y);
            }

            return true;
        });
    }
}
