const { createWorker } = require('tesseract.js');

const rectangles = [
  {
    left: 56, 
    top: 35, 
    width: 157, 
    height: 57
  },
];

(async () => {
  const worker = await createWorker({
    logger: (m) => {
      console.log(m);
    },
  });

  await worker.loadLanguage('eng'); // 2
  await worker.initialize('eng');
  const values = [];

  for (let i = 0; i < rectangles.length; i++) {
    const {data: {text}} = await worker
    .recognize('./Images/test.jpg', { rectangle: rectangles[i] })
    .catch (err => {
      console.error(err);
    })
    .then(result => {
     console.log(result);
    }) // 3
    values.push(text);
  }
 
  // console.log(text);
  await worker.terminate();
})();