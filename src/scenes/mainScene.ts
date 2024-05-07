import Phaser from "phaser";
//import PhaserLogo from "../objects/phaserLogo";
import FpsText from "../objects/fpsText";
import { Zombie } from "../objects/ZombieChar"; // Assuming you have a Zombie class that extends GameCharacter
import { Ranger } from "../objects/RangerChar";
import { Projectile } from "../objects/Projectile";
import { Soldier } from "../objects/SoldierChar";
import { Wizard } from "../objects/WizardChar";
import { CharacterManager } from "../objects/CharacterManager";
import { GameCharacter } from "../objects/GameCharacter";
import { Board } from "../objects/board";
import { CommandLine } from "../objects/commandLine";

export default class MainScene extends Phaser.Scene {
    private edge: Phaser.Physics.Arcade.StaticGroup;
    private grunts?: Phaser.Physics.Arcade.Group;
    public projectiles?: Phaser.Physics.Arcade.Group;
    fpsText: FpsText;
    public board_map: Board;
    private gameOver = false;
    private gruntAmount = 10;
    private currentWave = 0;
    private maxWave = 5;
    private score = 0;
    private scoreText: Phaser.GameObjects.Text;
    private currency: number; // Player currency
    private health: number; // Health of the base
    private healthBar: Phaser.GameObjects.Graphics;
    private end: Phaser.Physics.Arcade.StaticGroup;
    private finish: Phaser.Physics.Arcade.StaticGroup;
    private yCoords = [320, 360, 400, 440, 485, 520, 560]; //coords in relation to the board tiles
    public characterManager: CharacterManager; //is a list of all the characters
    private userInput: string = "";
    private consoleDialogue?: Phaser.GameObjects.Text;
    private eventEmitter = new Phaser.Events.EventEmitter();
    private instructionDialogue?: Phaser.GameObjects.Text;
    private cdLsTut: boolean = false;
    private won: boolean = false;
    private inputBox: HTMLInputElement;
    private outputBox?: Phaser.GameObjects.Text;
    private readonly prompt: string = "";
    currencyText: Phaser.GameObjects.Text;
    private commandLine?: CommandLine;
    constructor() {
        super({ key: "MainScene" });
        this.characterManager = new CharacterManager();
        this.health = 100; // Initialize health
        this.currency = 50; // Starting currency
    }

    create() {
        const map_boardConfig = {
            rows: 5,
            cols: 7,
            cellWidth: 85,
            cellHeight: 100,
            posX: 280, // Centered X position for the board
            posY: 150, // Centered Y position for the board
        };
        const map_board = new Board(this, map_boardConfig);
        //map image
        this.add.image(400, 350, "map").setScale(1);

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

        //health bar stuff
        this.health = 100; // Starting health
        this.healthBar = this.add.graphics();
        this.updateHealthBar();

        this.commandLine = new CommandLine(
            this,
            this.characterManager,
            this.currency
        );

        // create the board for enemy spawn
        const spawn_boardConfig = {
            rows: 5,
            cols: 5,
            cellWidth: 85,
            cellHeight: 100,
            posX: 870, // Centered X position for the board
            posY: 150, // Centered Y position for the board
        };

        //enemy spawn board
        const spawn_board = new Board(this, spawn_boardConfig);

        const soldierPosition = map_board.getCellPosition(1, 4);
        let soldier = new Soldier(this, soldierPosition.x, soldierPosition.y);
        let ranger = new Ranger(this, 330, 500);
        let wizard = new Wizard(this, 330, 600);

        this.characterManager.addCharacter(soldier);
        this.characterManager.addCharacter(ranger);
        this.characterManager.addCharacter(wizard);

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

        this.projectiles = this.physics.add.group({
            classType: Projectile,
        });

        //this.edge.create(0, 0, "finishLine");
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

        this.grunts = this.physics.add.group({
            classType: Zombie, // Ensure all members of the group are Zombie instances
            key: "zombieTexture",
            repeat: this.gruntAmount - 1,
            setXY: { x: 850, y: 525, stepX: 60 },
        });
        this.grunts.children.iterate((child) => {
            const zombie = child as Zombie;
            //const randomIndex = Phaser.Math.Between(0, this.yCoords.length - 1);
            zombie.setY(spawn_board.getRandomCellPosition().y);
            zombie.setVelocityX(Phaser.Math.FloatBetween(-50, -10)); // zombie speed
            zombie.setPushable(false);
            return true;
        });
        this.grunts.children.iterate((child) => {
            const zombie = child as Zombie; // Ensure correct casting
            zombie.setScale(1.1); // Now you can safely apply setScale
            zombie.setOrigin(0.5, 0.95); // Adjusting origin for better alignment
            zombie.body?.setSize(20, 55); //sets the hitbox size for the zombies
            return true;
        });
        const sButton = this.add.image(500, 100, "button").setInteractive();
        const rButton = this.add.image(800, 100, "button").setInteractive();
        const wButton = this.add.image(1100, 100, "button").setInteractive();
        sButton.setVisible(false);
        rButton.setVisible(false);
        wButton.setVisible(false);
        this.physics.add.collider(
            this.grunts,
            this.edge,
            (zombie, platform) => {
                if (
                    zombie instanceof Zombie &&
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

        const message = `Phaser v${Phaser.VERSION}`;
        this.add
            .text(this.cameras.main.width - 15, 15, message, {
                color: "#000000",
                fontSize: "24px",
            })
            .setOrigin(1, 0);

        this.score = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let scoreText = this.add.text(15, 50, "Score: 0", {
            fontSize: "20px",
            color: "black",
        });

        this.physics.add.collider(
            this.grunts,
            this.projectiles,
            (zombie, projectile) => {
                // Cast zombie and projectile to their expected types
                let z = zombie as Phaser.Physics.Arcade.Sprite;
                let p = projectile as Phaser.Physics.Arcade.Sprite;

                if (map_board.isWithinBounds(z.x, z.y)) {
                    // Ensure the collision affects only those zombies within the board
                    if (z instanceof Zombie && p instanceof Projectile) {
                        z.takeDamage(p.damage);
                    }
                }
                // Destroy the projectile regardless of the zombie's position
                p.destroy();
            }
        );
    }

    private enemyHitWall() {
        console.log("hit wall enemy");
    }
    private handleHitWall(zombie: Zombie): void {
        // Assume each collision with the platform causes a fixed amount of damage
        this.health -= zombie.dmg;
        this.updateHealthBar();

        if (this.health <= 0) {
            this.gameOver = true;
            this.physics.pause();
            console.log("Game Over");
        }
        zombie.destroy();
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
        if (this.gruntAmount === 0) {
            if (this.currentWave === this.maxWave) {
                //If we're on wave 3 (max) and gruntAmount is zero, that means the player has defeated all waves
                //this.victoryText.visible = true;
                this.gameOver = false;
            } else {
                this.currentWave += 1; //Increment the wave amount to make more baddies spawn
                this.gruntAmount = this.currentWave * 2;
                this.grunts?.createMultiple({
                    key: "zombieTexture",
                    repeat: this.gruntAmount - 1,
                    setXY: { x: 60, y: 0, stepX: 60 },
                });
                this.grunts?.children.iterate((child) => {
                    const zombie = child as Phaser.Physics.Arcade.Sprite;
                    zombie.setVelocity(0, Phaser.Math.FloatBetween(-50, -10));
                    return true;
                });
            }
        }
        this.grunts?.children.iterate((child, idx) => {
            const zombie = child as Phaser.Physics.Arcade.Sprite;

            if (zombie.x <= 475) {
                console.log(idx + ":x:" + zombie.x + "y: " + zombie.y);
            }

            return true;
        });

        this.projectiles?.children.iterate((child) => {
            const projectile = child as Projectile; // Ensure correct casting
            projectile.setVelocityX(300);
            return true;
        });
        this.characterManager.update();
    }
}