const fileInput = document.getElementById("fileInput");

const originalCanvas = document.getElementById("originalCanvas");
const canvasA = document.getElementById("canvasA");
const canvasB = document.getElementById("canvasB");

const originalCtx = originalCanvas.getContext("2d");
const ctxA = canvasA.getContext("2d");
const ctxB = canvasB.getContext("2d");

let currentImage = null;

fileInput.addEventListener("change", loadImage);

function loadImage(event)
{
    const file = event.target.files[0];

    if (!file)
    {
        return;
    }

    const img = new Image();

    img.onload = function ()
    {
        currentImage = img;

        drawOriginal();

        updateImageA();

        updateImageB();
    };

    img.src = URL.createObjectURL(file);
}

function drawOriginal()
{
    originalCanvas.width = currentImage.width;
    originalCanvas.height = currentImage.height;

    originalCtx.clearRect(0, 0, currentImage.width, currentImage.height);

    originalCtx.drawImage(currentImage, 0, 0);
}

function updateImageA()
{
    // 後で作る
}

function updateImageB()
{
    // 後で作る
}
