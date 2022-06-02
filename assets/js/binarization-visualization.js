class BinarizationVisualizer extends Visualizer {
    constructor(size, image) {
        super(size, image);
        this.threshold = 128;
        this.createThresholdInput();
        setTimeout(() => {
            this.changeLargePixel(this.colors[this.row][this.column]);
        }, 100);
    }

    createThresholdInput() {
        let inputGroup = document.createElement('div');
        inputGroup.classList.add('d-inline-block');

        let text = document.createElement('div');
        text.classList.add('mathjax-font', 'd-inline-block', 'align-middle', 'ms-3');
        text.innerHTML = 'T';

        let input = document.createElement('input');
        input.classList.add('form-control', 'd-inline-block', 'threshold-input', 'align-middle', 'ms-2');
        input.type = 'number';
        input.id = 'threshold';
        input.value = this.threshold;

        let btn = document.createElement('button');
        btn.classList.add('btn', 'bg-blue', 'text-white', 'd-inline-block', 'align-middle', 'ms-1');
        btn.innerText = '↻';
        btn.addEventListener('click', () => {
            this.forwardBtn.classList.remove('pulse-btn');
            this.threshold = parseInt(input.value);

            this.togglePixel(this.row, this.column);
            this.toggleProcessedPixel(this.row, this.column);

            let pixelGrid = document.getElementById('new-grid-container');
            pixelGrid.innerHTML = '';
            this.processedPixels = this.fillProcessedPixelGrid();
            [this.row, this.column] = [0, 0];
            this.togglePixel(this.row, this.column);
            this.toggleProcessedPixel(this.row, this.column);
            this.updateInstructions();
        });

        inputGroup.appendChild(text);
        inputGroup.appendChild(input);
        inputGroup.appendChild(btn);

        let btnGroup = document.getElementsByClassName('btn-arrows')[0];
        btnGroup.appendChild(inputGroup);
    }

    updateInstructions() {
        let instructions = document.getElementById('instructions');
        instructions.innerHTML = '';

        let color = this.colors[this.row][this.column];
        let brightness = Math.round(0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]);

        if (brightness >= this.threshold) {
            this.changeProcessedPixelColor([255, 255, 255]);
        } else {
            this.changeProcessedPixelColor([0, 0, 0]);
        }

        let instructionHeaders = [
            'Вычисление яркости пикселя',
            `Сравнение яркости с пороговым значением&nbsp;<span class="mathjax-font">T = ${this.threshold}</span>`
        ];

        let instructionDescriptions = [
            'brightness = ' +
            `0.299 ⋅ <span class="color-red">${color[0]}</span> + ` +
            `0.587 ⋅ <span class="color-green">${color[1]}</span> + ` +
            `0.114 ⋅ <span class="color-blue">${color[2]}</span> = ${brightness}`,
            brightness >= this.threshold ? `${brightness} ≥ ${this.threshold} → 255` : `${brightness} < ${this.threshold} → 0`
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
}

let image = new Image();
image.src = '../static/img/visualization-pixels.png';

const visualizer = new BinarizationVisualizer(5, image);
