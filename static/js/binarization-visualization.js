let size = 5;

let canvas = document.createElement('canvas');
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext('2d');

let image = new Image();
image.src = 'static/img/visualization-pixels.png';

let container = document.getElementById('grid-container');
let newContainer = document.getElementById('new-grid-container');
let normalPixelPath = 'M 3 0 L 30 0 A 3 3 0 0 1 33 3 L 33 30 A 3 3 0 0 1 30 33 L 3 33 A 3 3 0 0 1 0 30 L 0 3 A 3 3 0 0 1 3 0';
let largePixelPath = 'M 4 0 L 48 0 A 4 4 0 0 1 52 4 L 52 48 A 4 4 0 0 1 48 52 L 4 52 A 4 4 0 0 1 0 48 L 0 4 A 4 4 0 0 1 4 0';

let colors = [];
let pixels;
let largePixel;

image.onload = () => {
    ctx.drawImage(image, 0, 0);
    for (let i = 0; i < size; ++i) {
        colors.push([]);
        for (let j = 0; j < size; ++j) {
            const pixelData = ctx.getImageData(i, j, 1, 1).data;
            colors[i].push([pixelData[0], pixelData[1], pixelData[2]]);
        }
    }

    function createPixels(size) {
        let pixels = [];
        for (let i = 0; i < size; ++i) {
            pixels.push([]);
            for (let j = 0; j < size; ++j) {
                let element = document.createElement('div');
                element.className = "grid-element";
                element.style.backgroundColor = 'rgb(' + colors[i][j][0] + ', ' + colors[i][j][1] + ', ' + colors[i][j][2] + ')';
                //let draw = SVG().width(33).height(33).addTo(element);
                container.appendChild(element);
                //draw.path(normalPixelPath).fill('rgb(' + colors[i][j][0] + ', ' + colors[i][j][1] + ', ' + colors[i][j][2] + ')');
                pixels[i].push(element);
            }
        }
        return pixels;
    }

    pixels = createPixels(size);
    largePixel = drawLargePixel();
    selectPixel(0, 0);
    calcBrightness(colors[j][i]);
}

function selectPixel(i, j) {
    pixels[i][j].classList.replace('grid-element', 'selected-grid-element');
    changeLargePixelColor(colors[i][j]);
}

function turnDownPixel(i, j) {
    pixels[i][j].classList.replace('selected-grid-element', 'grid-element');
}

function drawLargePixel() {
    let largePixelContainer = document.getElementById('large-element');
    let largePixel = SVG().width(52).height(52).addTo(largePixelContainer);
    largePixel.path(largePixelPath);
    largePixelContainer.firstChild.classList.add('large-element');
    return largePixel;
}

function changeLargePixelColor(color) {
    largePixel.fill('rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')');
    let colorCode = document.getElementById('color-code');
    let RGB = '<b>R</b> ' + color[0] + '<br><b>G</b> ' + color[1] + '<br><b>B</b> ' + color[2];
    //let hex = '<br><b>HEX</b> #' + color[0].toString(16) + color[1].toString(16) + color[2].toString(16);
    colorCode.innerHTML = RGB;
}

let backBtn = document.getElementById('back');
let forwardBtn = document.getElementById('forward');
let i = 0;
let j = 0;

function nextIndex(i, j) {
    let nextI = i, nextJ = j;
    if (j + 1 < size) {
        ++nextJ;
    } else {
        if (i + 1 < size) {
            ++nextI;
            nextJ = 0;
        } else {
            nextI = 0;
            nextJ = 0;
        }
    }
    return [nextI, nextJ];
}

function prevIndex(i, j) {
    let prevI = i, prevJ = j;
    if (j - 1 >= 0) {
        --prevJ;
    } else {
        if (i - 1 >= 0) {
            --prevI;
            prevJ = size - 1;
        } else {
            prevI = size - 1;
            prevJ = size - 1;
        }
    }
    return [prevI, prevJ];
}

forwardBtn.addEventListener('click', () => {
    turnDownPixel(i, j);
    [i, j] = nextIndex(i, j);
    selectPixel(i, j);
    calcBrightness(colors[i][j]);
});

backBtn.addEventListener('click', () => {
    turnDownPixel(i, j);
    [i, j] = prevIndex(i, j);
    selectPixel(i, j);
    calcBrightness(colors[i][j]);
});

function calcBrightness(color) {
    let instructions = document.getElementById('instructions');
    instructions.innerHTML = '';
    let number = document.createElement('div');
    number.className = 'instruction-number';
    number.innerHTML = '1';
    let instruction = document.createElement('div');
    instruction.className = 'instruction';
    instruction.innerHTML = 'Вычисление яркости пикселя';
    instructions.append(number, instruction);
    let brightness = Math.round(0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]);
    let instructionText = document.createElement('div');
    instructionText.classList.add('mathjax-font', 'instruction-formula');
    instructionText.innerHTML = 'brightness = 0.299 ⋅ ' + color[0] + ' + 0.587 ⋅ ' + color[1] + ' + 0.114 ⋅ ' + color[2]
        + ' = ' + brightness;
    instructions.append(document.createElement('div'), instructionText);

    number = document.createElement('div');
    number.className = 'instruction-number';
    number.innerHTML = '2';
    instruction = document.createElement('div');
    instruction.className = 'instruction';
    instruction.innerHTML = 'Сравнение яркости с пороговым значением&nbsp;<span class="mathjax-font">T = 128</span>';
    instructions.append(number, instruction);

    instructionText = document.createElement('div');
    instructionText.classList.add('mathjax-font', 'instruction-formula');

    if (brightness >= 128) {
        instructionText.innerHTML += brightness + ' ≥ 128 → 255';
        if (isTimeToUpdate()) {
            appendProcessedPixel([255, 255, 255]);
        }
    } else {
        instructionText.innerHTML += brightness + ' < 128 → 0';
        if (isTimeToUpdate()) {
            appendProcessedPixel([0, 0, 0]);
        }
    }
    instructions.append(document.createElement('div'), instructionText);
}

let newPixels = [];
for (let i = 0; i < size; ++i) {
    newPixels.push([]);
    for (let j = 0; j < size; ++j) {
        newPixels[i].push(false);
    }
}
let lastPixelIndex = [0, -1];

function isTimeToUpdate() {
    if (lastPixelIndex[0] === 4 && lastPixelIndex[1] === 4) {
        return false;
    }
    let nextPixelIndex = nextIndex(...lastPixelIndex);
    if (nextPixelIndex[0] === i && nextPixelIndex[1] === j) {
        lastPixelIndex = nextPixelIndex;
        return true;
    }
    return false;
}

function appendProcessedPixel(color) {
    let element = document.createElement('div');
    element.classList.add('grid-element');
    if (color[0] + color[1] + color[2] === 255 * 3) {
        element.classList.add('bright');
    }
    let draw = SVG().width(33).height(33).addTo(element);
    newContainer.appendChild(element);
    draw.path(normalPixelPath).fill('rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')');
    newPixels[i][j] = true;
}