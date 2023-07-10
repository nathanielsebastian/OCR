const { createWorker } = Tesseract;

const progress = document.getElementById('progress')
const textarea = document.getElementById('textarea')
const canvas = document.getElementById("cv1")

document.querySelector('input[type="file"]').onchange = function() {
    let img = this.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(img)

    reader.onload = function() {
        drawImage(reader.result)
    }
}

let last_mousex = last_mousey = 0;
let mousex = mousey = 0;
let mousedown = false;
let rect = {};
const ctx = cv1.getContext("2d");

cv1.addEventListener("mouseup", function (e) {
  mousedown = false;
}, false);

cv1.addEventListener("mousedown", function (e) {
  last_mousex = parseInt(e.clientX-cv1.offsetLeft);
  last_mousey = parseInt(e.clientY-cv1.offsetTop);
  mousedown = true;
}, false);

cv1.addEventListener("mousemove", function (e) {
  mousex = parseInt(e.clientX-cv1.offsetLeft);
  mousey = parseInt(e.clientY-cv1.offsetTop);
  if(mousedown) {
      ctx.beginPath();
      var width = mousex-last_mousex;
      var height = mousey-last_mousey;
      ctx.rect(last_mousex,last_mousey,width,height);
      rect = {x: last_mousex, y: last_mousey, width, height};
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
  }
}, false);

function drawImage(url) {
  let image = new Image()
  image.src = url
  image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height
      ctx.drawImage(image, 0, 0)

      let src = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // Tesseract.recognize(src).progress((p) => {
      //     progress.innerHTML = p.progress
      // }).then((r) => {
      //     textarea.value = r.text
      // })

      scanImg(src);
  }
}

function scanImg(url){
  (async () => {
    const worker = await createWorker({
      logger: (m) => {
        console.log(m);
      },
    });
    await worker.load();
    await worker.loadLanguage('eng'); // 2
    await worker.initialize('eng');
    await worker.setParameters({preserve_interword_spaces: '1'})
    const {
      data: { text },
    } = await worker.recognize(url);
    textarea.innerHTML = text;
    await worker.terminate();
  })();
}

function insertTextToDom(text) {
  textarea.innerHTML = text;
}