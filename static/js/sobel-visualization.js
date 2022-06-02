class SobelVisualizer extends Visualizer {
    constructor(size, image) {
        super(size, image);
        this.selectedPixelClass = 'small-selected-grid-element';
        this.kernelX = [
            [1, 0, -1],
            [2, 0, -2],
            [1, 0, -1]
        ];
        this.kernelY = [
            [1, 2, 1],
            [0, 0, 0],
            [-1, -2, -1]
        ];
        this.activeKernel = this.kernelX;
        this.kernelBtn = this.createKernelButton();

        this.row = 1;
        this.column = 1;

        setTimeout(() => {
            this.togglePixel(this.row, this.column);
            this.toggleProcessedPixel(this.row, this.column);
            this.switchPixel(this.row, this.column);
            this.switchPixel(this.row, this.column);
        }, 100);
    }

    createKernelButton() {
        let toggleBtn = document.createElement('button');
        toggleBtn.classList.add('btn', 'bg-blue', 'text-white', 'kernel-btn');
        toggleBtn.setAttribute('data-bs-toggle', 'button');
        toggleBtn.id = 'kernel-btn';
        toggleBtn.innerHTML = 'Y';

        toggleBtn.addEventListener('click', () => {
            this.forwardBtn.classList.remove('pulse-btn');
            this.setActiveKernel();
            this.switchPixel(this.row, this.column);
        });
        document.getElementsByClassName('btn-arrows')[0].appendChild(toggleBtn);
        return toggleBtn;
    }

    setActiveKernel() {
        if (this.kernelBtn.classList.contains('active')) {
            this.activeKernel = this.kernelY;
            this.kernelBtn.innerHTML = 'Y';
        } else {
            this.activeKernel = this.kernelX;
            this.kernelBtn.innerHTML = 'X';
        }
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

    switchPixel(row, column) {
        this.turnOffAllPixels();
        [this.row, this.column] = [row, column];
        for (let i = 0; i <= 2; ++i) {
            for (let j = 0; j <= 2; ++j) {
                if (!(this.row - 1 + i < 0 || this.row - 1 + i >= this.size ||
                    this.column - 1 + j < 0 || this.column - 1 + j >= this.size)) {
                    this.togglePixel(this.row - 1 + i, this.column - 1 + j);

                    let value = document.createElement('div');
                    value.classList.add('kernel-value-large');
                    value.innerHTML = this.activeKernel[i][j];
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

        let values = [[], []];
        let derivativeLabel = [`<div class="me-3">G<sub>x</sub> = `, `<div class="me-3">G<sub>y</sub> = `];
        let sum = [];
        let kernels = [this.kernelX.flat(), this.kernelY.flat()];

        for (let i = 0; i < 2; ++i) {
            for (let j in brightnesses) {
                let value = brightnesses[j] * kernels[i][j];
                values[i].push(value);
                derivativeLabel[i] += `${brightnesses[j]} ⋅ ${(kernels[i][j] < 0) ? '(' + kernels[i][j] + ')': kernels[i][j]} + `;
            }
            derivativeLabel[i] = derivativeLabel[i].slice(0, -2);
            let total = 0;
            for (let value of values[i]) {
                total += value;
            }
            sum.push(Math.round(total / values[i].length));
            derivativeLabel[i] += `= ${sum[i]}</div>`;
        }

        let sobelValue = Math.sqrt(sum[0] * sum[0] + sum[1] * sum[1]);
        let sobelValueLabel = `G = √<span style="text-decoration: overline">${sum[0]}<sup>2</sup> + ${sum[1]}<sup>2</sup></span> = ${Number(sobelValue).toFixed(2)} ≈ ${Math.round(sobelValue)}`;

        this.changeProcessedPixelColor([Math.round(sobelValue), Math.round(sobelValue), Math.round(sobelValue)]);

        let instructionHeaders = [
            'Вычисление яркости пикселей',
            `Произведение яркости пикселей на соответствующие значения ядра Собеля&nbsp;(<span class="mathjax-font">x</span>)`,
            `Произведение яркости пикселей на соответствующие значения ядра Собеля&nbsp;(<span class="mathjax-font">y</span>)`,
            `Вычисление итогого значения по формуле`
        ];

        let instructionDescriptions = [
            brightnessLabels,
            derivativeLabel[0],
            derivativeLabel[1],
            sobelValueLabel
        ];

        let formula = '';
        let labels = instructionDescriptions[0];
        for (let label of labels.slice(1)) {
            formula += label + '<br>';
        }

        let brightnessInstruction =
            `<div class="instruction-number">1</div>` +
            `<div class="instruction">${instructionHeaders[0]}</div>` +
            `<div></div>` +
            `<div class="instruction-formula mathjax-font">${labels[0]}<br>
                <button class="btn bg-light-blue open-btn mt-1" id="btn1">• • •</button>
                <div class="invisible-formulas mt-1" id="formulas1">${formula}</div>
                </div>`;

        instructions.innerHTML += brightnessInstruction;

        for (let i = 1; i < instructionHeaders.length; ++i) {
            let instruction =
                `<div class="instruction-number">${i + 1}</div>` +
                `<div class="instruction">${instructionHeaders[i]}</div>` +
                `<div></div>` +
                `<div class="instruction-formula mathjax-font">${instructionDescriptions[i]}</div>`;

            instructions.innerHTML += instruction;
        }

        setTimeout(() => {
            let btn = document.getElementById(`btn1`);
            btn.addEventListener('click', () => {
                let formulas = document.getElementById(`formulas1`);
                if (formulas.classList.contains('invisible-formulas')) {
                    formulas.classList.replace('invisible-formulas', 'visible-formulas');
                } else {
                    formulas.classList.replace('visible-formulas', 'invisible-formulas');
                }
            });
        }, 500);
    }
}

function calcBrightness(color) {
    return Math.round(0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]);
}

let image = new Image();
image.src = '../static/img/visualization-pixels.png';

const visualizer = new SobelVisualizer(5, image);
