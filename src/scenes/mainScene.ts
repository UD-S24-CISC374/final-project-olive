import Phaser from "phaser";
//import PhaserLogo from "../objects/phaserLogo";
import FpsText from "../objects/fpsText";
import { Zombie } from "../objects/ZombieChar"; // Assuming you have a Zombie class that extends GameCharacter
//import { Soldier } from "../objects/SoldierChar";
import { Ranger } from "../objects/RangerChar";
import { Projectile } from "../objects/Projectile";
import { Soldier } from "../objects/SoldierChar";
import { Wizard } from "../objects/WizardChar";
import { CharacterManager } from "../objects/CharacterManager";
import { GameCharacter } from "../objects/GameCharacter";

export default class MainScene extends Phaser.Scene {
    private edge: Phaser.Physics.Arcade.StaticGroup;
    private grunts?: Phaser.Physics.Arcade.Group;
    public projectiles?: Phaser.Physics.Arcade.Group;
    fpsText: FpsText;
    private gameOver = false;
    private gruntAmount = 10;
    private currentWave = 0;
    private maxWave = 5;
    private score = 0;
    private scoreText: Phaser.GameObjects.Text;
    private end: Phaser.Physics.Arcade.StaticGroup;
    private finish: Phaser.Physics.Arcade.StaticGroup;
    private yCoords = [320, 360, 400, 440, 485, 520, 560]; //coords in relation to the board tiles
    public characterManager: CharacterManager; //is a list of all the characters

    constructor() {
        super({ key: "MainScene" });
        this.characterManager = new CharacterManager();
    }

    create() {
        this.add.image(700, 400, "grass");
        this.add.image(1100, 400, "grass");
        let ground = this.add.image(5, 300, "trainGrounds");
        ground.flipX = true;

        let soldier = new Soldier(this, 600, 400);
        let ranger = new Ranger(this, 600, 485);
        let wizard = new Wizard(this, 700, 500);

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
            525,
            400,
            "platform"
        ) as Phaser.Physics.Arcade.Sprite;
        // After rotating the platform
        platform.angle = 90;
        // Manually set the size of the physics body
        platform.body?.setSize(30, 400);
        this.grunts = this.physics.add.group({
            classType: Zombie, // Ensure all members of the group are Zombie instances
            key: "zombieTexture",
            repeat: this.gruntAmount - 1,
            setXY: { x: 1100, y: 525, stepX: 60 },
        });
        this.grunts.children.iterate((child) => {
            const zombie = child as Zombie;
            const randomIndex = Phaser.Math.Between(0, this.yCoords.length - 1);
            zombie.setY(this.yCoords[randomIndex]);
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

        //
        let commandLine = this.add
            .text(700, 600, "> ", {
                fontFamily: "Arial",
                fontSize: "20px",
                color: "black",
            })
            .setInteractive();
        commandLine.setVisible(false);
        commandLine.setScale(2);
        button.on("pointerup", () => {
            commandLine.setVisible(true);
            this.physics.pause();
            console.log("button happened");
        });

        commandLine.on("pointerup", () => {
            console.log("command line Clicked");
        });

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
                projectile.destroy(); // Destroy the projectile on impact

                if (zombie instanceof Zombie) {
                    const proj = projectile as Projectile;
                    zombie.takeDamage(proj.damage); // Now safely calling takeDamage on zombie
                } else {
                    console.error("Colliding object is not a Zombie");
                }
            }
        );

        const inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.style.width = "300px";
        inputBox.style.height = "30px";
        inputBox.style.position = "absolute";
        inputBox.style.left = "300px";
        inputBox.style.top = "500px";
        document.body.appendChild(inputBox);
    }

    private enemyHitWall() {
        console.log("hit wall enemy");
    }
    private handleHitWall() {
        this.physics.pause();
        this.grunts?.remove;
        this.gameOver = false;
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
