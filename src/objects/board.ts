import Phaser from "phaser";

interface BoardConfig {
    rows: number;
    cols: number;
    cellWidth: number;
    cellHeight: number;
    posX: number;
    posY: number;
}

export class Board {
    scene: Phaser.Scene;
    config: BoardConfig;
    cells: Phaser.GameObjects.Rectangle[][];
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(scene: Phaser.Scene, config: BoardConfig) {
        this.scene = scene;
        this.config = config;
        this.cells = this.createBoard();
        this.x = config.posX;
        this.y = config.posY;
        this.width = config.cols * config.cellWidth;
        this.height = config.rows * config.cellHeight;
    }

    private createBoard(): Phaser.GameObjects.Rectangle[][] {
        let cells = [];
        for (let y = 0; y < this.config.rows; y++) {
            let row = [];
            for (let x = 0; x < this.config.cols; x++) {
                let cell = this.createCell(x, y);
                row.push(cell);
            }
            cells.push(row);
        }
        return cells;
    }

    private createCell(col: number, row: number) {
        const { cellWidth, cellHeight } = this.config;
        const x = this.config.posX + col * cellWidth + cellWidth / 2;
        const y = this.config.posY + row * cellHeight + cellHeight / 2;
        const rect = this.scene.add
            .rectangle(
                x,
                y,
                cellWidth,
                cellHeight,
                0xffffff,
                0.2 // Adjust transparency as needed
            )
            .setStrokeStyle(2, 0x000000); // Black border for clarity
        this.scene.add.existing(rect);
        return rect;
    }
    getCellPosition(col: number, row: number) {
        const cell = this.cells[row][col];
        return { x: cell.x, y: cell.y };
    }

    getRandomCellPosition() {
        const row = Phaser.Math.Between(0, this.config.rows - 1);
        const col = Phaser.Math.Between(0, this.config.cols - 1);
        const cell = this.cells[row][col];
        return { x: cell.x, y: cell.y + 55 };
    }

    isWithinBounds(x: number, y: number) {
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height + 55
        );
    }
}
