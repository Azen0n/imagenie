class Visualizer {
    constructor(size, image) {
        this.size = size;
        this.image = image;
        this.backBtn = document.getElementById('back');
        this.forwardBtn = document.getElementById('forward');

        this.row = 0;
        this.column = 0;
        this.largePixel = document.getElementById('large-element');

        this.image.onload = () => {
            this.colors = this.getColors();
            this.pixels = this.fillPixelGrid();
            this.processedPixels = this.fillProcessedPixelGrid();
            this.togglePixel(this.row, this.column);
            this.updateInstructions();
            this.backBtn.disabled = true;
        }

        this.forwardBtn.addEventListener('click', () => {
            this.switchPixel(...this.nextPixel());
        });

        this.backBtn.addEventListener('click', () => {
            this.switchPixel(...this.prevPixel());
        });
    }

    getColors() {
        let canvas = document.createElement('canvas');
        canvas.width = this.size;
        canvas.height = this.size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.image, 0, 0, this.size, this.size);

        let colors = [];
        for (let i = 0; i < this.size; ++i) {
            colors.push([]);
            for (let j = 0; j < this.size; ++j) {
                const pixelData = ctx.getImageData(i, j, 1, 1).data;
                colors[i].push([pixelData[0], pixelData[1], pixelData[2]]);
            }
        }
        return colors;
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
                pixel.addEventListener('click', () => {
                    this.switchPixel(i, j);
                });
                pixelGrid.appendChild(pixel);
                pixels[i].push(pixel);
            }
        }
        return pixels;
    }

    RGBAsString(color) {
        return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    }

    fillProcessedPixelGrid() {
        let pixelGrid = document.getElementById('new-grid-container');
        let pixels = [];
        for (let i = 0; i < this.size; ++i) {
            pixels.push([]);
            for (let j = 0; j < this.size; ++j) {
                let pixel = document.createElement('div');
                pixel.className = "grid-element";
                pixel.style.backgroundColor = 'rgb(255, 255, 255)';
                pixelGrid.appendChild(pixel);
                pixels[i].push(pixel);
            }
        }
        return pixels;
    }

    switchPixel(row, column) {
        this.togglePixel(this.row, this.column);
        [this.row, this.column] = [row, column];
        this.togglePixel(this.row, this.column);
        this.changeLargePixel(this.colors[this.row][this.column]);
        this.updateInstructions();

        this.backBtn.disabled = this.row === 0 && this.column === 0;
    }

    togglePixel(row, column) {
        let pixel = this.pixels[row][column];
        let processedPixel = this.processedPixels[row][column];

        if (pixel.classList.contains('selected-grid-element')) {
            pixel.classList.replace('selected-grid-element', 'grid-element');
            processedPixel.classList.replace('selected-grid-element', 'grid-element');
        } else {
            pixel.classList.replace('grid-element', 'selected-grid-element');
            processedPixel.classList.replace('selected-grid-element', 'grid-element');
        }
    }

    changeLargePixel(color) {
        this.largePixel.style.backgroundColor = 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')';
        let colorCode = document.getElementById('color-code');
        colorCode.innerHTML =
            '<div class="color-red"><b>R</b> ' + color[0] + '</div>' +
            '<div class="color-green"><b>G</b> ' + color[1] + '</div>' +
            '<div class="color-blue"><b>B</b> ' + color[2] + '</div>';
    }

    updateInstructions() {
        let instructions = document.getElementById('instructions');
        instructions.innerHTML = '';

        let color = this.colors[this.row][this.column];
        let threshold = 128;
        let brightness = Math.round(0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]);

        if (brightness >= threshold) {
            this.changeProcessedPixelColor([255, 255, 255]);
        } else {
            this.changeProcessedPixelColor([0, 0, 0]);
        }

        let instructionHeaders = [
            'Вычисление яркости пикселя',
            `Сравнение яркости с пороговым значением&nbsp;<span class="mathjax-font">T = ${threshold}</span>`
        ];

        let instructionDescriptions = [
            'brightness = ' +
            `0.299 ⋅ <span class="color-red">${color[0]}</span> + ` +
            `0.587 ⋅ <span class="color-green">${color[1]}</span> + ` +
            `0.114 ⋅ <span class="color-blue">${color[2]}</span> = ${brightness}`,
            brightness >= threshold ? `${brightness} ≥ ${threshold} → 255` : `${brightness} < ${threshold} → 0`
        ];

        for (let i = 0; i < instructionHeaders.length; ++i) {
            let instruction =
                `<div class="instruction-number">${i + 1}</div>` +
                `<div class="instruction">${instructionHeaders[i]}</div>` +
                `<div></div>` +
                `<div class="instruction-formula mathjax-font">${instructionDescriptions[i]}</div>`;

            instructions.innerHTML += instruction;
        }
    }

    changeProcessedPixelColor(color) {
        let pixel = this.processedPixels[this.row][this.column];
        if (mean(color) > 245) {
            pixel.classList.add('bright');
        }
        pixel.style.backgroundColor = this.RGBAsString(color);
    }

    nextPixel() {
        let row = this.row, column = this.column;
        if (++column >= this.size) {
            column = 0;
            if (++row >= this.size) {
                row = 0;
            }
        }
        return [row, column];
    }

    prevPixel() {
        let row = this.row, column = this.column;
        if (--column < 0) {
            column = this.size - 1;
            if (--row < 0) {
                row = this.size - 1;
            }
        }
        return [row, column];
    }
}

function mean(array) {
    let sum = array.reduce((sum, a) => sum + a, 0);
    return sum / array.length;
}

let image = new Image();
image.src = '../static/img/visualization-pixels.png';

const visualizer = new Visualizer(5, image);
