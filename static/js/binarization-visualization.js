let size = 5;

let canvas = document.createElement('canvas');
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext('2d');

let image = new Image();
image.src = 'static/img/visualization-pixels.png';

let container = document.getElementById('grid-container');
let newContainer = document.getElementById('new-grid-container');
let largePixelPath = 'M 4 0 L 48 0 A 4 4 0 0 1 52 4 L 52 48 A 4 4 0 0 1 48 52 L 4 52 A 4 4 0 0 1 0 48 L 0 4 A 4 4 0 0 1 4 0';

let colors = [];
let pixels;
let newPixels;
let largePixel;

let backBtn = document.getElementById('back');
let forwardBtn = document.getElementById('forward');
let i = 0;
let j = 0;

image.onload = () => {
    ctx.drawImage(image, 0, 0);
    for (let i = 0; i < size; ++i) {
        colors.push([]);
        for (let j = 0; j < size; ++j) {
            const pixelData = ctx.getImageData(i, j, 1, 1).data;
            colors[i].push([pixelData[0], pixelData[1], pixelData[2]]);
        }
    }

    pixels = createPixels(size);
    newPixels = createNewPixels(size);
    largePixel = drawLargePixel();
    selectPixel(i, j);
    calcBrightness(colors[i][j]);
    backBtn.disabled = true;
}

function createPixels(size) {
    let pixels = [];
    for (let i = 0; i < size; ++i) {
        pixels.push([]);
        for (let j = 0; j < size; ++j) {
            let element = document.createElement('div');
            element.className = "grid-element";
            element.style.backgroundColor = 'rgb(' + colors[i][j][0] + ', ' + colors[i][j][1] + ', ' + colors[i][j][2] + ')';
            container.appendChild(element);
            pixels[i].push(element);
        }
    }
    return pixels;
}

function createNewPixels(size) {
    let pixels = [];
    for (let i = 0; i < size; ++i) {
        pixels.push([]);
        for (let j = 0; j < size; ++j) {
            let element = document.createElement('div');
            element.className = "grid-element";
            element.style.backgroundColor = 'rgb(255, 255, 255)';
            newContainer.appendChild(element);
            pixels[i].push(element);
        }
    }
    return pixels;
}

function selectPixel(i, j) {
    pixels[i][j].classList.replace('grid-element', 'selected-grid-element');
    newPixels[i][j].classList.replace('grid-element', 'selected-grid-element');
    changeLargePixelColor(colors[i][j]);
}

function turnDownPixel(i, j) {
    pixels[i][j].classList.replace('selected-grid-element', 'grid-element');
    newPixels[i][j].classList.replace('selected-grid-element', 'grid-element');
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
    colorCode.innerHTML = '<b>R</b> ' + color[0] + '<br><b>G</b> ' + color[1] + '<br><b>B</b> ' + color[2];
}

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
    backBtn.disabled = i === 0 && j === 0;
});

backBtn.addEventListener('click', () => {
    turnDownPixel(i, j);
    [i, j] = prevIndex(i, j);
    selectPixel(i, j);
    calcBrightness(colors[i][j]);
    backBtn.disabled = i === 0 && j === 0;
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
        changeNewPixelColor([255, 255, 255]);
    } else {
        instructionText.innerHTML += brightness + ' < 128 → 0';
        changeNewPixelColor([0, 0, 0]);
    }
    instructions.append(document.createElement('div'), instructionText);
}

function changeNewPixelColor(color) {
    if (color[0] + color[1] + color[2] === 255 * 3) {
        newPixels[i][j].classList.add('bright');
    }
    newPixels[i][j].style.backgroundColor = 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')';
}