class GaussianVisualizer extends Visualizer {
    constructor(size, image) {
        super(size, image);
        this.selectedPixelClass = 'small-selected-grid-element';
        this.kernel = [
            ['1', '2', '1'],
            ['2', '4', '2'],
            ['1', '2', '1']
        ];

        setTimeout(() => {
            this.togglePixel(this.row, this.column);
            this.toggleProcessedPixel(this.row, this.column);
            this.switchPixel(this.row, this.column);
        }, 100);
    }

    switchPixel(row, column) {
        this.turnOffAllPixels();
        [this.row, this.column] = [row, column];
        for (let i = 0; i <= 2; ++i) {
            for (let j = 0; j <= 2; ++j) {
                if (!(this.row - 1 + i < 0 || this.row - 1 + i >= this.size ||
                    this.column - 1 + j < 0 || this.column - 1 + j >= this.size)) {
                    this.togglePixel(this.row - 1 + i, this.column - 1 + j);
                    this.updateInstructions();

                    let value = document.createElement('div');
                    value.classList.add('kernel-value', 'mathjax-font');
                    value.innerHTML = this.kernel[i][j];
                    if (calcBrightness(this.colors[this.row - 1 + i][this.column - 1 + j]) > 128) {
                        value.style.color = this.RGBAsString([0, 0, 0]);
                    } else {
                        value.style.color = this.RGBAsString([255, 255, 255]);
                    }
                    this.pixels[this.row - 1 + i][this.column - 1 + j].appendChild(value);
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
                this.pixels[i][j].innerHTML = '';
                this.processedPixels[i][j].classList = 'grid-element';
            }
        }
    }
}

function calcBrightness(color) {
    return Math.round(0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]);
}

let image = new Image();
image.src = '../static/img/visualization-pixels.png';

const visualizer = new GaussianVisualizer(5, image);

