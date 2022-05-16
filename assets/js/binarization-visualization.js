class BinarizationVisualizer extends Visualizer {
    constructor(size, image) {
        super(size, image);
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
}

let image = new Image();
image.src = '../static/img/visualization-pixels.png';

const visualizer = new BinarizationVisualizer(5, image);
