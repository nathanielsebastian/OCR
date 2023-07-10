const { createWorker } = Tesseract;

const progress = document.getElementById('progress')
const textarea = document.getElementById('textarea')
const canvas = document.getElementById("canvas")

document.querySelector('input[type="file"]').onchange = function() {
    let img = this.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(img)

    reader.onload = function() {
        drawImage(reader.result)
    }
}

function drawImage(url) {
  let ctx = canvas.getContext('2d')
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

async function scanImg(url){
  const worker = await createWorker({
    logger: (m) => {
      console.log(m);
    },
  });

  await worker.loadLanguage('eng'); // 2
  await worker.initialize('eng');

  await worker.setParameters({preserve_interword_spaces: '1'})
  const {
    data: { text },
  } = await worker.recognize(url);
  textarea.innerHTML = text;
  await worker.terminate();
}