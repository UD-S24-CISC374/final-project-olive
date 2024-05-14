import MainScene from "../scenes/mainScene";
import { BaddiesManager } from "./baddiesManager";
import { Wave } from "./wave";

export class WaveManager {
    private waves: Wave[];
    private currentWaveIndex: number = 0;
    mainScene: MainScene;
    baddiesManager: BaddiesManager;
    isDelayingNextWave: boolean;

    constructor(scene: MainScene, baddiesManager: BaddiesManager) {
        this.isDelayingNextWave = false; // Add this flag
        this.mainScene = scene;
        this.baddiesManager = baddiesManager;
        this.waves = [
            new Wave(scene, baddiesManager, 10, 2000),
            new Wave(scene, baddiesManager, 15, 1800),
            new Wave(scene, baddiesManager, 20, 1500),
        ];
    }

    startNextWave() {
        if (this.currentWaveIndex < this.waves.length) {
            this.waves[this.currentWaveIndex++].start();
        } else {
            console.log("All waves completed. Maybe loop or end game?");
        }
    }

    update() {
        if (
            this.currentWaveIndex > 0 &&
            this.waves[this.currentWaveIndex - 1].isComplete() &&
            !this.isDelayingNextWave // Check if we are not already delaying
        ) {
            this.isDelayingNextWave = true; // Set the flag to true to prevent re-entry
            this.mainScene.time.delayedCall(
                8000,
                () => {
                    this.startNextWave();
                    this.isDelayingNextWave = false; // Reset the flag after delay
                },
                [],
                this
            );
        }
    }
}
