import Phaser from "phaser";
import { BaddyCharacter } from "./baddyCharacter";
import { Zombie1 } from "./Zombie1Char"; // Assuming Zombie1 is a specific class extending BaddyCharacter
import MainScene from "../scenes/mainScene";
import TutorialScene from "../scenes/tutorialScene";

export class BaddiesManager {
    public baddies: Phaser.Physics.Arcade.Group;
    mainScene: MainScene | TutorialScene;
    size: number;

    constructor(scene: MainScene | TutorialScene) {
        this.mainScene = scene;
        this.size = 0;

        this.baddies = this.mainScene.physics.add.group({
            classType: Zombie1,
            key: "Zombie1",
        });
    }

    addCharacter(type: string, baddy: BaddyCharacter) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        //const typeKey = type.charAt(0).toUpperCase() + type.slice(1); // Ensure first letter is uppercase
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this.baddies) {
            //a bunch of if statements to handle configs for each bad guy
            if (type === "Zombie1") {
                baddy.setY(
                    this.mainScene.board_map.getRandomCellPosition().y + 60
                );
                baddy.setVelocityX(Phaser.Math.FloatBetween(-50, -10));
                baddy.setPushable(false);
                baddy.setScale(1.1); // Now you can safely apply setScale
                baddy.setOrigin(0.5, 0.95); // Adjusting origin for better alignment
                baddy.body?.setSize(20, 55); //set hitbox size

                this.baddies.add(baddy);
                this.size++;
            }
        } else {
            console.warn(`No group found for type ${type}`);
        }
    }

    removeCharacter(type: string, baddy: Phaser.GameObjects.GameObject) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this.baddies) {
            baddy.destroy();
            this.baddies.remove(baddy, true, true);
            this.size--;
        }
    }

    update() {
        this.baddies.children.iterate((child) => {
            const zombie = child as Phaser.Physics.Arcade.Sprite;
            zombie.setVelocityX(Phaser.Math.FloatBetween(-50, -10));
            return true;
        });
    }
}
