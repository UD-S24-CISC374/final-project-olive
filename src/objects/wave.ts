import Phaser from "phaser";
import { BaddiesManager } from "./baddiesManager";
import { Zombie1 } from "./Zombie1Char";
import MainScene from "../scenes/mainScene";
import TutorialScene from "../scenes/tutorialScene";

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

    //once we have more baddies we will have to implement a randomizer that randomizes types of baddies
    //that spawn depending on the difficulty. For now logic is for only one zommbie type
    spawnEnemy() {
        const x = 950; // Starting X position for enemies {might need to randomize a bit; not really?}
        const y = this.mainScene.spawn_board.getRandomCellPosition().y + 60;
        const zombie1 = new Zombie1(this.mainScene, x, y); // Parameters might need to be adjusted
        zombie1.setVelocityX(Phaser.Math.FloatBetween(-50, -10)); // zombie speed
        zombie1.setPushable(false);
        zombie1.setScale(1.1); // Now you can safely apply setScale
        zombie1.setOrigin(0.5, 0.95); // Adjusting origin for better alignment
        zombie1.body?.setSize(20, 55); //sets the hitbox size for the zombies
        this.manager.addCharacter("Zombie1", zombie1);
        this.enemiesSpawned++;
    }

    //might have a bug here soon
    isComplete() {
        return (
            this.enemiesSpawned >= this.totalEnemies && this.manager.size === 0
        );
    }
}
