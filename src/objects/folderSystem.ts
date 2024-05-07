// FolderSystem.ts
import { GameCharacter } from "./GameCharacter";
import Phaser from "phaser";
import { Soldier } from "./SoldierChar";
import { Ranger } from "./RangerChar";
import { Wizard } from "./WizardChar";

export interface Folder {
    name: string;
    type: "folder" | "character";
    children?: Folder[];
    price?: number;
    createCharacter?: (
        scene: Phaser.Scene,
        x: number,
        y: number
    ) => GameCharacter;
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
                        type: "character",
                        price: 10,
                        createCharacter: (scene, x, y) =>
                            new Soldier(scene, x, y),
                    },
                    {
                        name: "ranger",
                        type: "character",
                        price: 15,
                        createCharacter: (scene, x, y) =>
                            new Ranger(scene, x, y),
                    },
                    {
                        name: "wizard",
                        type: "character",
                        price: 20,
                        createCharacter: (scene, x, y) =>
                            new Wizard(scene, x, y),
                    },
                ],
            },
        ],
    };

    private currentPath: string[] = [];

    public findFolderByPath(path: string[]): Folder | null {
        let currentFolder: Folder = this.rootFolder;

        for (const folder of path) {
            const nextFolder = currentFolder.children?.find(
                (child) => child.name === folder && child.type === "folder"
            );
            if (nextFolder && nextFolder.type === "folder") {
                currentFolder = nextFolder;
            } else {
                return null;
            }
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
            return `${child.type === "folder" ? "[D]" : "[C]"} ${child.name}`;
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
            (child) =>
                child.name === characterName && child.type === "character"
        );

        if (
            !character ||
            character.type !== "character" ||
            !character.createCharacter
        ) {
            return null;
        }

        return character.createCharacter(scene, x, y);
    }
}
