const saveAPng = document.getElementById("saveAPng");
const saveAJpg = document.getElementById("saveAJpg");

const saveBPng = document.getElementById("saveBPng");
const saveBJpg = document.getElementById("saveBJpg");

saveAPng.addEventListener("click", () => saveCanvas(canvasA, "png"));
saveAJpg.addEventListener("click", () => saveCanvas(canvasA, "jpg"));

saveBPng.addEventListener("click", () => saveCanvas(canvasB, "png"));
saveBJpg.addEventListener("click", () => saveCanvas(canvasB, "jpg"));

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
    canvasA.width = currentImage.width;
    canvasA.height = currentImage.height;

    ctxA.drawImage(currentImage, 0, 0);

    const imageData = ctxA.getImageData(0, 0, canvasA.width, canvasA.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4)
    {
        //--------------------------------------------------
        // RGBを0～1へ
        //--------------------------------------------------

        let r = data[i] / 255.0;
        let g = data[i + 1] / 255.0;
        let b = data[i + 2] / 255.0;

        //--------------------------------------------------
        // 基準輝度
        //--------------------------------------------------

        const targetL = 128.0 / 255.0;

        //--------------------------------------------------
        // 輝度 (BT.601)
        //--------------------------------------------------

        const l =
            r * 0.299 +
            g * 0.587 +
            b * 0.114;

        //--------------------------------------------------
        // 輝度との差
        //--------------------------------------------------

        const dr = r - l;
        const dg = g - l;
        const db = b - l;

        //--------------------------------------------------
        // 最大・最小差分
        //--------------------------------------------------

        const maxD = Math.max(dr, dg, db);
        const minD = Math.min(dr, dg, db);

        //--------------------------------------------------
        // 圧縮係数
        //--------------------------------------------------

        let s = 1.0;

        if (maxD > 0.0)
        {
            s = Math.min(s, (1.0 - targetL) / maxD);
        }

        if (minD < 0.0)
        {
            s = Math.min(s, (0.0 - targetL) / minD);
        }

        //--------------------------------------------------
        // RGB再合成
        //--------------------------------------------------

        r = targetL + s * dr;
        g = targetL + s * dg;
        b = targetL + s * db;

        //--------------------------------------------------
        // ネガポジ反転
        //--------------------------------------------------
        
        r = 1.0 - r;
        g = 1.0 - g;
        b = 1.0 - b;
        
        //--------------------------------------------------
        // 彩度調整 (_Saturation = 1.2)
        //--------------------------------------------------
        
        const saturation = 1.2;
        
        const gray =
            r * 0.299 +
            g * 0.587 +
            b * 0.114;
        
        r = gray + (r - gray) * saturation;
        g = gray + (g - gray) * saturation;
        b = gray + (b - gray) * saturation;
        
        //--------------------------------------------------
        // 範囲を0～1へ制限
        //--------------------------------------------------
        
        r = Math.min(1, Math.max(0, r));
        g = Math.min(1, Math.max(0, g));
        b = Math.min(1, Math.max(0, b));

        //--------------------------------------------------
        // 0～255へ戻す
        //--------------------------------------------------

        data[i] = Math.round(r * 255.0);
        data[i + 1] = Math.round(g * 255.0);
        data[i + 2] = Math.round(b * 255.0);
    }

    ctxA.putImageData(imageData, 0, 0);
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
