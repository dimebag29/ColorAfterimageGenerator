const fileInput = document.getElementById("fileInput");

const originalCanvas = document.getElementById("originalCanvas");
const originalCtx = originalCanvas.getContext("2d");

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
        originalCanvas.width = img.width;
        originalCanvas.height = img.height;

        originalCtx.clearRect(0, 0, img.width, img.height);
        originalCtx.drawImage(img, 0, 0);
    };

    img.src = URL.createObjectURL(file);
}
