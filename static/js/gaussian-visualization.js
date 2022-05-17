class GaussianVisualizer extends Visualizer {
    constructor(size, image) {
        super(size, image);
        this.selectedPixelClass = 'small-selected-grid-element';

        setTimeout(() => {
            this.togglePixel(this.row, this.column);
            this.toggleProcessedPixel(this.row, this.column);
            this.switchPixel(this.row, this.column);
        }, 100);
    }

    switchPixel(row, column) {
        this.turnOffAllPixels();
        [this.row, this.column] = [row, column];
        for (let i = row - 1; i <= row + 1; ++i) {
            for (let j = column - 1; j <= column + 1; ++j) {
                if (!(i < 0 || i >= this.size || j < 0 || j >= this.size)) {
                    this.togglePixel(i, j);
                    this.updateInstructions();

                    let value = document.createElement('div');
                    value.className = 'kernel-value';
                    value.innerHTML = '5';
                    this.pixels[i][j].appendChild(value);
                }
            }
        }
        this.toggleProcessedPixel(this.row, this.column);
        this.changeLargePixel(this.colors[this.row][this.column]);
        this.backBtn.disabled = this.row === 0 && this.column === 0;
    }

    turnOffAllPixels() {
        for (let i = 0; i < this.size; ++i) {
            for (let j = 0; j < this.size; ++j) {
                this.pixels[i][j].classList = 'grid-element';
                this.processedPixels[i][j].classList = 'grid-element';
            }
        }
    }
}

let image = new Image();
image.src = '../static/img/visualization-pixels.png';

const visualizer = new GaussianVisualizer(5, image);

