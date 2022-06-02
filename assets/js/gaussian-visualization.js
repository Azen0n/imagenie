class GaussianVisualizer extends Visualizer {
    constructor(size, image) {
        super(size, image);
        this.selectedPixelClass = 'small-selected-grid-element';
        this.sigma = 1;
        this.kernel = this.calcKernel(this.sigma);

        this.row = 1;
        this.column = 1;

        setTimeout(() => {
            this.togglePixel(this.row, this.column);
            this.toggleProcessedPixel(this.row, this.column);
            this.switchPixel(this.row, this.column);
            this.switchPixel(this.row, this.column);
            this.changeLargePixel(this.colors[this.row][this.column]);
        }, 100);
    }

    fillPixelGrid() {
        let pixelGrid = document.getElementById('grid-container');
        let pixels = [];
        for (let i = 0; i < this.size; ++i) {
            pixels.push([]);
            for (let j = 0; j < this.size; ++j) {
                let pixel = document.createElement('div');
                pixel.className = 'grid-element';
                pixel.style.backgroundColor = this.RGBAsString(this.colors[i][j]);
                if (!(i === 0 || i === this.size - 1 || j === 0 || j === this.size - 1)) {
                    pixel.addEventListener('click', () => {
                        this.switchPixel(i, j);
                    });
                }
                pixel.addEventListener('mouseenter', () => {
                    this.changeLargePixel(this.colors[i][j]);
                });
                pixelGrid.appendChild(pixel);
                pixels[i].push(pixel);
            }
        }
        return pixels;
    }

    nextPixel() {
        let row = this.row, column = this.column;
        if (++column >= this.size - 1) {
            column = 1;
            if (++row >= this.size - 1) {
                row = 1;
            }
        }
        return [row, column];
    }

    prevPixel() {
        let row = this.row, column = this.column;
        if (--column < 1) {
            column = this.size - 2;
            if (--row < 1) {
                row = this.size - 2;
            }
        }
        return [row, column];
    }

    calcKernel(sigma) {
        let kernel = [];
        for (let i = -1; i <= 1; ++i) {
            kernel.push([]);
            for (let j = -1; j <= 1; ++j) {
                kernel[i + 1].push(
                    1 / (2 * Math.PI * Math.pow(sigma, 2)) * Math.pow(Math.E, (-(Math.pow(i, 2) + Math.pow(j, 2)) / (2 * Math.pow(sigma, 2))))
                );
            }
        }
        return kernel;
    }

    switchPixel(row, column) {
        this.turnOffAllPixels();
        [this.row, this.column] = [row, column];
        for (let i = 0; i <= 2; ++i) {
            for (let j = 0; j <= 2; ++j) {
                if (!(this.row - 1 + i < 0 || this.row - 1 + i >= this.size ||
                    this.column - 1 + j < 0 || this.column - 1 + j >= this.size)) {
                    this.togglePixel(this.row - 1 + i, this.column - 1 + j);

                    let value = document.createElement('div');
                    value.classList.add('kernel-value');
                    value.innerHTML = Number(this.kernel[i][j]).toFixed(4);
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
        this.updateInstructions();
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

    updateInstructions() {
        let instructions = document.getElementById('instructions');
        instructions.innerHTML = '';

        let pixels = [];
        for (let i = 0; i <= 2; ++i) {
            for (let j = 0; j <= 2; ++j) {
                if (!(this.row - 1 + i < 0 || this.row - 1 + i >= this.size ||
                    this.column - 1 + j < 0 || this.column - 1 + j >= this.size)) {
                    let [i_, j_] = [this.row - 1 + i, this.column - 1 + j];
                    pixels.push([[i_, j_], this.colors[i_][j_]]);
                }
            }
        }

        let brightnesses = [];
        let brightnessLabels = [];
        for (let i in pixels) {
            let color = pixels[i][1];
            let brightness = Math.round(0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]);
            brightnesses.push(brightness);
            let [x, y] = [(i - (i % 3)) / 3, i % 3];
            brightnessLabels.push(
                `brightness<sub>${x},${y}</sub> = ` +
                `0.299 ⋅ <span class="color-red">${color[0]}</span> + ` +
                `0.587 ⋅ <span class="color-green">${color[1]}</span> + ` +
                `0.114 ⋅ <span class="color-blue">${color[2]}</span> = ${brightness}`
            );
        }

        let values = [];
        let valueLabels = [];
        let flatKernel = this.kernel.flat();
        for (let i in brightnesses) {
            let value = brightnesses[i] * flatKernel[i];
            values.push(value);
            let [x, y] = [(i - (i % 3)) / 3, i % 3];
            valueLabels.push(
                `value<sub>${x},${y}</sub> = ${brightnesses[i]} ⋅ ${Number(flatKernel[i]).toFixed(4)} = ${Number(value).toFixed(4)}`
            );
        }

        let sum = 0;
        let sumLabel = '';
        for (let i in values) {
            sum += values[i];
            sumLabel += `${Number(values[i]).toFixed(4)} + `;
        }

        sumLabel = sumLabel.substring(0, sumLabel.length - 2);

        sumLabel += `→ ${Math.round(sum)}`;
        sumLabel = [sumLabel];

        this.changeProcessedPixelColor([Math.round(sum), Math.round(sum), Math.round(sum)]);

        let instructionHeaders = [
            'Вычисление яркости пикселей',
            `Произведение яркости пикселей на соответствующие значения ядра, вычисленные по формуле&nbsp;<span class="mathjax-font">(1)</span>`,
            `Вычисление итогого значения как суммы произведений`
        ];

        let instructionDescriptions = [
            brightnessLabels,
            valueLabels,
            sumLabel
        ];

        for (let i = 0; i < instructionHeaders.length - 1; ++i) {

            let formula = '';
            let labels = instructionDescriptions[i];
            for (let label of labels.slice(1)) {
                formula += label + '<br>';
            }

            let instruction =
                `<div class="instruction-number">${i + 1}</div>` +
                `<div class="instruction">${instructionHeaders[i]}</div>` +
                `<div></div>` +
                `<div class="instruction-formula mathjax-font">${labels[0]}<br>
                 <button class="btn bg-light-blue open-btn mt-1" id="btn${i + 1}">• • •</button>
                 <div class="invisible-formulas mt-1" id="formulas${i + 1}">${formula}</div>
                 </div>`;

            instructions.innerHTML += instruction;
        }

        setTimeout(() => {
            for (let i = 0; i < 2; ++i) {
                let btn = document.getElementById(`btn${i + 1}`);

                btn.addEventListener('click', () => {
                    let formulas = document.getElementById(`formulas${i + 1}`);
                    if (formulas.classList.contains('invisible-formulas')) {
                        formulas.classList.replace('invisible-formulas', 'visible-formulas');
                    } else {
                        formulas.classList.replace('visible-formulas', 'invisible-formulas');
                    }
                });
            }
        }, 500);

        let instruction =
            `<div class="instruction-number">${3}</div>` +
            `<div class="instruction">${instructionHeaders[2]}</div>` +
            `<div></div>` +
            `<div class="instruction-formula mathjax-font">${instructionDescriptions[2][0]}</div>`

        instructions.innerHTML += instruction;
    }
}

function calcBrightness(color) {
    return Math.round(0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]);
}

let image = new Image();
image.src = '../static/img/visualization-pixels.png';

const visualizer = new GaussianVisualizer(5, image);
