class Visualizer {
    constructor(size, image) {
        this.size = size;
        this.image = image;
        this.backBtn = document.getElementById('back');
        this.forwardBtn = document.getElementById('forward');

        this.row = 0;
        this.column = 0;
        this.largePixel = document.getElementById('large-element');
        this.selectedPixelClass = 'selected-grid-element';

        this.image.onload = () => {
            this.colors = this.getColors();
            this.pixels = this.fillPixelGrid();
            this.processedPixels = this.fillProcessedPixelGrid();
            this.togglePixel(this.row, this.column);
            this.toggleProcessedPixel(this.row, this.column);
            this.updateInstructions();
            this.backBtn.disabled = true;
        }

        this.forwardBtn.addEventListener('click', () => {
            this.switchPixel(...this.nextPixel());
            this.forwardBtn.classList.remove('pulse-btn');
        });

        this.backBtn.addEventListener('click', () => {
            this.switchPixel(...this.prevPixel());
            this.forwardBtn.classList.remove('pulse-btn');
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
                    this.forwardBtn.classList.remove('pulse-btn');
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
        this.toggleProcessedPixel(this.row, this.column);
        [this.row, this.column] = [row, column];
        this.togglePixel(this.row, this.column);
        this.toggleProcessedPixel(this.row, this.column);
        this.changeLargePixel(this.colors[this.row][this.column]);
        this.updateInstructions();

        this.backBtn.disabled = this.row === 0 && this.column === 0;
    }

    togglePixel(row, column) {
        let pixel = this.pixels[row][column];

        if (pixel.classList.contains(this.selectedPixelClass)) {
            pixel.classList.replace(this.selectedPixelClass, 'grid-element');
        } else {
            pixel.classList.replace('grid-element', this.selectedPixelClass);
        }
    }

    toggleProcessedPixel(row, column) {
        let processedPixel = this.processedPixels[row][column];

        if (processedPixel.classList.contains(this.selectedPixelClass)) {
            processedPixel.classList.replace(this.selectedPixelClass, 'grid-element');
        } else {
            processedPixel.classList.replace('grid-element', this.selectedPixelClass);
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
        this.changeProcessedPixelColor(color);

        let instructionHeaders = [
            'Пояснение операции',
        ];

        let instructionDescriptions = [
            `2 + 2 = 4`,
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

let forwardBtn = document.getElementById('forward');
forwardBtn.addEventListener('click', () => {
    forwardBtn.classList.remove('pulse-btn');
});