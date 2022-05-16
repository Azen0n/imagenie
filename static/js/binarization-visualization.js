let size = 5;

let canvas = document.createElement('canvas');
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext('2d');

let image = new Image();
image.src = '../static/img/visualization-pixels.png';

let container = document.getElementById('grid-container');
let newContainer = document.getElementById('new-grid-container');

let colors = [];
let pixels;
let newPixels;
let largePixel = document.getElementById('large-element');

let backBtn = document.getElementById('back');
let forwardBtn = document.getElementById('forward');
let currentRow = 0;
let currentColumn = 0;

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
    selectPixel(currentRow, currentColumn);
    calcBrightness(colors[currentRow][currentColumn]);
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
            element.addEventListener('click', function () {
                turnDownPixel(currentRow, currentColumn);
                [currentRow, currentColumn] = [i, j];
                selectPixel(currentRow, currentColumn);
                calcBrightness(colors[currentRow][currentColumn]);
                backBtn.disabled = currentRow === 0 && currentColumn === 0;
            });
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

function changeLargePixelColor(color) {
    largePixel.style.backgroundColor = 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')';
    let colorCode = document.getElementById('color-code');
    colorCode.innerHTML =
        '<div class="color-red"><b>R</b> ' + color[0] + '</div>' +
        '<div class="color-green"><b>G</b> ' + color[1] + '</div>' +
        '<div class="color-blue"><b>B</b> ' + color[2] + '</div>';
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
    turnDownPixel(currentRow, currentColumn);
    [currentRow, currentColumn] = nextIndex(currentRow, currentColumn);
    selectPixel(currentRow, currentColumn);
    calcBrightness(colors[currentRow][currentColumn]);
    backBtn.disabled = currentRow === 0 && currentColumn === 0;
});

backBtn.addEventListener('click', () => {
    turnDownPixel(currentRow, currentColumn);
    [currentRow, currentColumn] = prevIndex(currentRow, currentColumn);
    selectPixel(currentRow, currentColumn);
    calcBrightness(colors[currentRow][currentColumn]);
    backBtn.disabled = currentRow === 0 && currentColumn === 0;
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
    instructionText.innerHTML = 'brightness = ' +
        '0.299 ⋅ <span class="color-red">' + color[0] + '</span> + ' +
        '0.587 ⋅ <span class="color-green">' + color[1] + '</span> + ' +
        '0.114 ⋅ <span class="color-blue">' + color[2] + '</span> = ' + brightness;
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
        newPixels[currentRow][currentColumn].classList.add('bright');
    }
    newPixels[currentRow][currentColumn].style.backgroundColor = 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')';
}