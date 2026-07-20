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
    canvasB.width = currentImage.width;
    canvasB.height = currentImage.height;

    ctxB.drawImage(currentImage, 0, 0);

    const imageData = ctxB.getImageData(0, 0, canvasB.width, canvasB.height);

    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4)
    {
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;

        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }

    ctxB.putImageData(imageData, 0, 0);
}

function saveCanvas(canvas, type)
{
    const link = document.createElement("a");

    if (type === "png")
    {
        link.download = "image.png";
        link.href = canvas.toDataURL("image/png");
    }
    else
    {
        link.download = "image.jpg";
        link.href = canvas.toDataURL("image/jpeg", 0.95);
    }

    link.click();
}
