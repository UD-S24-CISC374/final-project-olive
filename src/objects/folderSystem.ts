// FolderSystem.ts
import { GameCharacter } from "./GameCharacter";
import Phaser from "phaser";
import { Soldier } from "./SoldierChar";
import { Ranger } from "./RangerChar";
import { Wizard } from "./WizardChar";

interface Folder {
    name: string;
    type: "folder" | "file";
    children?: Folder[];
    price?: number;
    health?: number;
    damage?: number;
    createCharacter?: (
        scene: Phaser.Scene,
        x: number,
        y: number
    ) => GameCharacter;
    content?: string; // Text content for .txt files
}

export class FolderSystem {
    private rootFolder: Folder = {
        name: "/",
        type: "folder",
        children: [
            {
                name: "characters",
                type: "folder",
                children: [
                    {
                        name: "soldier",
                        type: "folder",
                        children: [
                            {
                                name: "soldier.txt",
                                type: "file",
                                content:
                                    "Name: Soldier\nCost: 10\nHealth: 100\nDamage: 20",
                            },
                        ],
                        price: 10,
                        health: 100,
                        damage: 20,
                        createCharacter: (scene, x, y) =>
                            new Soldier(scene, x, y),
                    },
                    {
                        name: "ranger",
                        type: "folder",
                        children: [
                            {
                                name: "ranger.txt",
                                type: "file",
                                content:
                                    "Name: Ranger\nCost: 20\nHealth: 100\nDamage: 50",
                            },
                        ],
                        price: 30,
                        health: 100,
                        damage: 50,
                        createCharacter: (scene, x, y) =>
                            new Ranger(scene, x, y),
                    },
                    {
                        name: "wizard",
                        type: "folder",
                        children: [
                            {
                                name: "wizard.txt",
                                type: "file",
                                content:
                                    "Name: Wizard\nCost: 30\nHealth: 100\nDamage: 20",
                            },
                        ],
                        price: 20,
                        health: 100,
                        damage: 20,
                        createCharacter: (scene, x, y) =>
                            new Wizard(scene, x, y),
                    },
                ],
            },
            {
                name: "baddies",
                type: "folder",
                children: [
                    {
                        name: "zombie1",
                        type: "folder",
                        children: [
                            {
                                name: "zombie1.txt",
                                type: "file",
                                content:
                                    "Name: Zombie1\nCost: 0\nHealth: 50\nDamage: 10",
                            },
                        ],
                        price: 0,
                        health: 50,
                        damage: 10,
                    },
                ],
            },
        ],
    };

    private currentPath: string[] = [];

    public findFolderByPath(path: string[]): Folder | null {
        let currentFolder: Folder = this.rootFolder;
        for (const part of path) {
            if (part === "") continue; // Ignore empty parts from leading slashes or errors
            let foundFolder = currentFolder.children?.find(
                (f) => f.name === part && f.type === "folder"
            );
            if (!foundFolder) return null; // Early exit if any part of the path is not found
            currentFolder = foundFolder;
        }
        return currentFolder;
    }

    public changeDirectory(folderName: string): string {
        if (folderName === "..") {
            if (this.currentPath.length > 0) {
                this.currentPath.pop();
            }
        } else {
            const currentFolder = this.findFolderByPath(this.currentPath);
            const targetFolder = currentFolder?.children?.find(
                (child) => child.name === folderName && child.type === "folder"
            );

            if (targetFolder) {
                this.currentPath.push(folderName);
            } else {
                return `Folder not found: ${folderName}`;
            }
        }
        return this.listContents();
    }

    public listContents(): string {
        const currentFolder = this.findFolderByPath(this.currentPath);
        if (!currentFolder) {
            return `Error: Path not found`;
        }

        const folderContents = currentFolder.children?.map((child) => {
            return `${child.type === "folder" ? "[D]" : "[F]"} ${child.name}`;
        });

        return (
            `Current Path: /${this.currentPath.join("/") || ""}\n` +
                folderContents?.join("\n") || ""
        );
    }

    public getCurrentPath(): string[] {
        return this.currentPath;
    }

    public getRootFolder(): Folder {
        return this.rootFolder;
    }

    public readFileContent(fileName: string): string {
        const pathParts = fileName.split("/");
        // Check if root directory should be skipped in path navigation
        const effectivePath =
            pathParts[0] === "" ? pathParts.slice(1) : pathParts;

        const file = this.findFolderByPath(
            effectivePath.slice(0, -1)
        )?.children?.find(
            (f) =>
                f.name === effectivePath[effectivePath.length - 1] &&
                f.type === "file"
        );

        return file?.content || "File not found";
    }

    public createCharacter(
        characterName: string,
        scene: Phaser.Scene,
        x: number,
        y: number
    ): GameCharacter | null {
        const charactersFolder = this.rootFolder.children?.find(
            (folder) => folder.name === "characters" && folder.type === "folder"
        );

        const character = charactersFolder?.children?.find(
            (child) => child.name === characterName && child.type === "folder"
        );

        if (
            !character ||
            character.type !== "folder" ||
            !character.createCharacter
        ) {
            return null;
        }

        return character.createCharacter(scene, x, y);
    }
}
