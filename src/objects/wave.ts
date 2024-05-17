import Phaser from "phaser";
import { BaddiesManager } from "./baddiesManager";
import { Zombie1 } from "./Zombie1Char";
import MainScene from "../scenes/mainScene";
import TutorialScene from "../scenes/tutorialScene";
import { Zombie2 } from "./Zombie2Char";

export class Wave {
    private manager: BaddiesManager;
    mainScene: MainScene | TutorialScene;
    private totalEnemies: number;
    private enemiesSpawned: number = 0;
    private spawnInterval: number; // Time between spawns

    constructor(
        scene: MainScene | TutorialScene,
        manager: BaddiesManager,
        totalEnemies: number,
        spawnInterval: number
    ) {
        this.mainScene = scene;
        this.manager = manager;
        this.totalEnemies = totalEnemies;
        this.spawnInterval = spawnInterval;
    }

    //might want to remove delay
    start() {
        this.mainScene.time.addEvent({
            delay: this.spawnInterval,
            repeat: this.totalEnemies - 1,
            callback: () => {
                this.spawnEnemy();
            },
            callbackScope: this,
        });
    }

    spawnEnemy() {
        const x = 950; // Starting X position for enemies
        const y = this.mainScene.spawn_board.getRandomCellPosition().y + 60;

        // Randomly choose between Zombie1 and Zombie2
        const zombieType = Phaser.Math.Between(1, 2);
        let zombie;

        if (zombieType === 1) {
            zombie = new Zombie1(this.mainScene, x, y);
        } else {
            zombie = new Zombie2(this.mainScene, x, y); // Assuming Zombie2 is defined similarly to Zombie1
        }

        zombie.setVelocityX(Phaser.Math.FloatBetween(-50, -10)); // Zombie speed
        zombie.setPushable(false);
        zombie.setScale(1.1); // Apply scaling
        zombie.setOrigin(0.5, 0.95); // Adjusting origin for better alignment
        zombie.body?.setSize(20, 55); // Sets the hitbox size for the zombies

        this.manager.addCharacter(
            zombieType === 1 ? "Zombie1" : "Zombie2",
            zombie
        );
        this.enemiesSpawned++;
    }

    //might have a bug here soon
    isComplete() {
        return (
            this.enemiesSpawned >= this.totalEnemies && this.manager.size === 0
        );
    }
}
