// Board.ts
import Phaser from "phaser";

interface BoardConfig {
    rows: number;
    cols: number;
    cellWidth: number;
    cellHeight: number;
    posX: number;
    posY: number;
}

interface Cell {
    col: number;
    row: number;
    x: number;
    y: number;
    rectangle: Phaser.GameObjects.Rectangle;
}

export class Board {
    scene: Phaser.Scene;
    config: BoardConfig;
    cells: Cell[][];
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(scene: Phaser.Scene, config: BoardConfig) {
        this.scene = scene;
        this.config = config;
        this.x = config.posX;
        this.y = config.posY;
        this.width = config.cols * config.cellWidth;
        this.height = config.rows * config.cellHeight;
        this.cells = this.createBoard();
    }

    private createBoard(): Cell[][] {
        let cells: Cell[][] = [];

        for (let row = 0; row < this.config.rows; row++) {
            let rowCells: Cell[] = [];

            for (let col = 0; col < this.config.cols; col++) {
                const { cellWidth, cellHeight } = this.config;
                const x = this.config.posX + col * cellWidth + cellWidth / 2;
                const y = this.config.posY + row * cellHeight + cellHeight / 2;
                const rect = this.scene.add
                    .rectangle(x, y, cellWidth, cellHeight, 0xffffff, 0.2)
                    .setStrokeStyle(2, 0x000000); // Black border for clarity

                this.scene.add.existing(rect);

                const cell: Cell = {
                    col,
                    row,
                    x,
                    y,
                    rectangle: rect,
                };

                rowCells.push(cell);
            }

            cells.push(rowCells);
        }

        return cells;
    }

    getCellPosition(col: number, row: number) {
        if (
            row >= 0 &&
            row < this.config.rows &&
            col >= 0 &&
            col < this.config.cols
        ) {
            const cell = this.cells[row][col];
            return { x: cell.x, y: cell.y };
        }
        return { x: 0, y: 0 };
    }

    getRandomCellPosition() {
        const row = Phaser.Math.Between(0, this.config.rows - 1);
        const col = Phaser.Math.Between(0, this.config.cols - 1);
        const cell = this.cells[row][col];
        return { x: cell.x, y: cell.y };
    }

    isWithinBounds(x: number, y: number) {
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height + 60
        );
    }

    public getCellFromCoordinates(x: number, y: number): Cell | null {
        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.cols; col++) {
                const cell = this.cells[row][col];
                if (x === cell.x && y === cell.y) {
                    return cell;
                }
            }
        }
        return null;
    }
}
