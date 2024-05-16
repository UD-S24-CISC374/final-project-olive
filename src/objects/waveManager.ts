import MainScene from "../scenes/mainScene";
import { BaddiesManager } from "./baddiesManager";
import { Wave } from "./wave";

export class WaveManager {
    private waves: Wave[];
    public currentWaveIndex: number = 0;
    mainScene: MainScene;
    baddiesManager: BaddiesManager;
    isWaveActive: boolean = false; // Track if a wave is active

    constructor(scene: MainScene, baddiesManager: BaddiesManager) {
        this.mainScene = scene;
        this.baddiesManager = baddiesManager;
        this.waves = [
            new Wave(scene, baddiesManager, 10, 2000),
            new Wave(scene, baddiesManager, 15, 1800),
            new Wave(scene, baddiesManager, 20, 1500),
        ];
    }

    startNextWave(): string {
        if (!this.isWaveActive && this.currentWaveIndex < this.waves.length) {
            this.isWaveActive = true; // Set the wave as active
            this.waves[this.currentWaveIndex++].start();
            return "Wave started";
        } else if (this.currentWaveIndex >= this.waves.length) {
            return "Cannot start next wave, this is the last wave";
        } else {
            return "A wave is currently active. Wait until it finishes.";
        }
    }

    update() {
        // Here, you might check conditions to set isWaveActive to false when a wave ends
        if (
            this.isWaveActive &&
            this.baddiesManager.size === 0 &&
            this.waves[this.currentWaveIndex - 1].isComplete()
        ) {
            this.isWaveActive = false;
            console.log("Wave completed. You can now start a new wave.");
        }
    }
}
