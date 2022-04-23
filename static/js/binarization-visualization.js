let size = 5;

let canvas = document.createElement('canvas');
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext('2d');

let image = new Image();
image.src = document.getElementById("img-original").src;

let container = document.getElementById('grid-container');
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
                let draw = SVG().width(33).height(33).addTo(element);
                container.appendChild(element);
                draw.path(normalPixelPath).fill('rgb(' + colors[i][j][0] + ', ' + colors[i][j][1] + ', ' + colors[i][j][2] + ')');
                pixels[i].push(element);
            }
        }
        return pixels;
    }

    pixels = createPixels(size);
    largePixel = drawLargePixel();
    selectPixel(0, 0);
}

function selectPixel(i, j) {
    pixels[i][j].classList.replace('grid-element', 'selected-grid-element');
    changeLargePixelColor(colors[j][i]);
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
    let hex = '<br><b>HEX</b> #' + color[0].toString(16) + color[1].toString(16) + color[2].toString(16);
    colorCode.innerHTML = RGB + hex;
}

let backBtn = document.getElementById('back');
let forwardBtn = document.getElementById('forward');
let i = 0;
let j = 0;

forwardBtn.addEventListener('click', () => {
    turnDownPixel(i, j);
    if (j + 1 < size) {
        ++j;
    } else {
        if (i + 1 < size) {
            ++i;
            j = 0;
        } else {
            i = 0;
            j = 0;
        }
    }
    selectPixel(i, j);
});

backBtn.addEventListener('click', () => {
    turnDownPixel(i, j);
    if (j - 1 >= 0) {
        --j;
    } else {
        if (i - 1 >= 0) {
            --i;
            j = size - 1;
        } else {
            i = size - 1;
            j = size - 1;
        }
    }
    selectPixel(i, j);
});
