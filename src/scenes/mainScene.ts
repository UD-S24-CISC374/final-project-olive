import Phaser from "phaser";
//import PhaserLogo from "../objects/phaserLogo";
import FpsText from "../objects/fpsText";
import { Projectile } from "../objects/Projectile";
import { CharacterManager } from "../objects/CharacterManager";
import { GameCharacter } from "../objects/GameCharacter";
import { Board } from "../objects/board";
import { CommandLine } from "../objects/commandLine";
import { WaveManager } from "../objects/waveManager";
import { BaddiesManager } from "../objects/baddiesManager";
import { Zombie1 } from "../objects/Zombie1Char";
import { BaddyCharacter } from "../objects/baddyCharacter";

export default class MainScene extends Phaser.Scene {
    private inputBox: HTMLInputElement;
    private outputBox?: Phaser.GameObjects.Text;
    private edge: Phaser.Physics.Arcade.StaticGroup;
    //private grunts?: Phaser.Physics.Arcade.Group;
    waveManager: WaveManager;
    baddiesManager: BaddiesManager;
    public projectiles?: Phaser.Physics.Arcade.Group;
    fpsText: FpsText;
    public board_map: Board;
    private map_boardConfig = {
        rows: 5,
        cols: 7,
        cellWidth: 85,
        cellHeight: 100,
        posX: 280, // Centered X position for the board
        posY: 150, // Centered Y position for the board
    };
    public spawn_board: Board;
    private spawn_boardConfig = {
        rows: 5,
        cols: 5,
        cellWidth: 85,
        cellHeight: 100,
        posX: 870, // Centered X position for the board
        posY: 150, // Centered Y position for the board
    };
    private gameOver = false;
    private gruntAmount = 50;
    private currentWave = 0;
    private maxWave = 5;
    private score = 0;
    private scoreText: Phaser.GameObjects.Text;
    public currency: number; // Player currency
    private health: number; // Health of the base
    private healthBar: Phaser.GameObjects.Graphics;
    private end: Phaser.Physics.Arcade.StaticGroup;
    private finish: Phaser.Physics.Arcade.StaticGroup;
    public characterManager: CharacterManager; //is a list of all the characters
    private userInput: string = "";
    private consoleDialogue?: Phaser.GameObjects.Text;
    private eventEmitter = new Phaser.Events.EventEmitter();
    private instructionDialogue?: Phaser.GameObjects.Text;
    private won: boolean = false;
    private readonly prompt: string = "";
    currencyText: Phaser.GameObjects.Text;
    private commandLine?: CommandLine;
    gameMusic: Phaser.Sound.BaseSound;

    constructor() {
        super({ key: "MainScene" });
        this.characterManager = new CharacterManager();
        this.health = 100; // Initialize health
        this.currency = 50; // Starting currency
    }

    create() {
        //map board
        this.board_map = new Board(this, this.map_boardConfig);
        //map image
        this.add.image(400, 350, "map").setScale(1);
        //background audio
        this.gameMusic = this.sound.add("backgroundMusic");
        this.gameMusic.play({ volume: 0.4, loop: true });
        //Win and Lose images
        var winImg = this.add.image(500, 500, "youWin");
        winImg.alpha = 0;
        //enemy spawn board
        this.spawn_board = new Board(this, this.spawn_boardConfig);
        this.baddiesManager = new BaddiesManager(this);

        this.waveManager = new WaveManager(this, this.baddiesManager);
        //currency
        // Add currency text
        this.currencyText = this.add.text(
            500,
            5,
            `Currency: ${this.currency}`,
            {
                fontSize: "30px",
                color: "white",
            }
        );
        //help button
        let help = this.add.image(800, 100, "questionMark").setInteractive();
        help.setScale(1 / 2);
        help.on("pointerover", () => {
            console.log("hovered over");
        });
        help.on("pointerout", () => {
            console.log("not hovered over");
        });

        //health bar stuff
        this.health = 100; // Starting health
        this.healthBar = this.add.graphics();
        this.updateHealthBar();

        this.commandLine = new CommandLine(this, this.characterManager);

        this.time.addEvent({
            delay: 2000, // Attack every 2000 ms (2 seconds)
            callback: () => {
                this.characterManager.characters.forEach((character) => {
                    const gameCharacter = character as GameCharacter;
                    gameCharacter.attack();
                });
            },
            loop: true,
        });

        // When creating projectiles, ensure they are active and can interact
        this.projectiles = this.physics.add.group({
            classType: Projectile,
            runChildUpdate: true, // Ensures projectile update logic is executed
        });

        this.edge = this.physics.add.staticGroup();
        let platform = this.edge.create(
            270,
            400,
            "platform"
        ) as Phaser.Physics.Arcade.Sprite;
        // After rotating the platform
        platform.angle = 90;
        // Manually set the size of the physics body
        platform.body?.setSize(30, 500);
        platform.setVisible(false);

        this.physics.add.collider(
            this.baddiesManager.baddies,
            this.edge,
            (zombie, platform) => {
                if (
                    zombie instanceof Zombie1 &&
                    platform instanceof Phaser.Physics.Arcade.Sprite
                ) {
                    this.handleHitWall(zombie);
                }
            },
            undefined,
            this
        );

        // Command Line Console
        this.consoleDialogue = this.add.text(100, 160, "", {
            fontSize: "24px",
            color: "green",
            backgroundColor: "#000000",
        });

        this.fpsText = new FpsText(this);

        this.outputBox = this.createOutputBox(870, 0, 410, 650);

        this.inputBox = this.createInputBox(670, 575, 310);

        this.score = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let scoreText = this.add.text(15, 50, "Score: 0", {
            fontSize: "20px",
            color: "black",
        });

        this.waveManager.startNextWave(); // Start the first wave

        this.physics.add.collider(
            this.baddiesManager.baddies,
            this.edge,
            (zombie, platform) => {
                if (
                    zombie instanceof Zombie1 &&
                    platform instanceof Phaser.Physics.Arcade.Sprite
                ) {
                    this.handleHitWall(zombie);
                }
            },
            undefined,
            this
        );

        this.physics.add.collider(
            this.baddiesManager.baddies,
            this.projectiles,
            (zombie, projectile) => {
                // Cast zombie and projectile to their expected types
                let z = zombie as Phaser.Physics.Arcade.Sprite;
                let p = projectile as Phaser.Physics.Arcade.Sprite;

                if (this.board_map.isWithinBounds(z.x, z.y)) {
                    // Ensure the collision affects only those zombies within the board
                    if (z instanceof Zombie1 && p instanceof Projectile) {
                        z.takeDamage(p.damage);
                        this.flashEnemy(z);
                    }
                }
                // Destroy the projectile regardless of the zombie's position
                p.destroy();
            }
        );
        if (this.gruntAmount === 0) {
            this.win();
            this.tweens.add({
                targets: winImg,
                alpha: 1,
                duration: 2000,
                ease: "Linear",
                delay: 0,
            });
        }
    }

    private enemyHitWall() {
        console.log("hit wall enemy");
    }

    private handleHitWall(baddy: BaddyCharacter): void {
        // Assume each collision with the platform causes a fixed amount of damage
        this.health -= baddy.dmg;
        this.updateHealthBar();

        if (this.health <= 50) {
            this.gameMusic.stop();
            this.gameMusic = this.sound.add("endGameMusic");
            this.gameMusic.play();
        }

        if (this.health <= 0) {
            this.lose();
        }
        this.baddiesManager.removeCharacter("Zombie1", baddy);
    }
    flashEnemy(zombie: Zombie1) {
        const originalTint = zombie.tint;
        zombie.setTint(0xff0000);
        setTimeout(() => {
            zombie.setTint(originalTint);
        }, 500);
    }
    private win() {
        this.gameMusic.stop();
        this.gameMusic = this.sound.add("victoryMusic");
        this.gameMusic.play({ volume: 0.4, loop: true });
        this.physics.pause();
        this.won = true;

        console.log("Game Won");
    }
    private lose() {
        this.gameMusic.stop();
        this.gameMusic = this.sound.add("defeatMusic");
        this.gameMusic.play({ volume: 0.4, loop: true });
        this.gameOver = true;
        this.physics.pause();
        console.log("Game Over");
    }

    updateHealthBar() {
        this.healthBar.clear();
        this.healthBar.fillStyle(0x00ff00, 1);
        this.healthBar.fillRect(200, 10, 200 * (this.health / 100), 20);
    }

    increaseCurrency(amount: number) {
        this.currency += amount;
        this.currencyText.setText(`Currency: ${this.currency}`);
    }

    private createInputBox(
        x: number,
        y: number,
        width: number
    ): HTMLInputElement {
        const input = document.createElement("input");
        input.type = "text";
        input.style.position = "fixed"; // Change to `fixed` position
        input.style.width = `${width}px`;
        input.style.fontSize = "20px";
        input.style.backgroundColor = "#000";
        input.style.color = "green";
        input.style.border = "1px solid #888";
        input.style.padding = "5px";
        input.style.outline = "none";
        input.style.zIndex = "1";

        document.body.appendChild(input);

        const updateInputPosition = () => {
            const canvas = this.game.canvas;
            const rect = canvas.getBoundingClientRect(); // Get the canvas's bounding rectangle

            input.style.left = `${rect.left + x}px`; // Use the canvas's position for `left`
            input.style.top = `${rect.top + y}px`; // Use the canvas's position for `top`
        };

        // Set the initial position
        updateInputPosition();

        // Update the position on window resize
        window.addEventListener("resize", updateInputPosition);

        // Process the command on 'Enter' key
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                const command = input.value;
                this.commandLine?.processCommand(command);
                input.value = "";
            }
        });

        return input;
    }

    private createOutputBox(
        x: number,
        y: number,
        width: number,
        height: number
    ): Phaser.GameObjects.Text {
        const outputBox = this.add.text(x, y, "", {
            fontSize: "24px",
            color: "green",
            backgroundColor: "#000000",
            wordWrap: { width: width },
            padding: { top: 10, bottom: 10, left: 10, right: 10 },
        });
        outputBox.setFixedSize(width, height);
        return outputBox;
    }

    updateOutputText(output: string) {
        this.outputBox?.setText(output);
    }

    update() {
        this.fpsText.update();
        this.waveManager.update();

        this.projectiles?.children.iterate((child) => {
            const projectile = child as Projectile; // Ensure correct casting
            projectile.setVelocityX(300);
            return true;
        });
        this.characterManager.update();
        this.baddiesManager.update();
    }
}
