const Tesseract = require('tesseract.js');
const Jimp = require('jimp');
const axios = require('axios');


//Read plane captcha image
const captchaUrl1 = 'https://i.ibb.co/jTKYQqP/Captcha-United.png';
axios({
    method: 'get',
    url: captchaUrl1,
    responseType: 'arraybuffer'
  }).then(response => {
    const imageData = Buffer.from(response.data, 'binary');
    // Use Tesseract.js to recognize the captcha text
    Tesseract.recognize(imageData)
  .then(result => {
    console.log(result.data.text); // Output the recognized text
  });

  });






//READ LINED CAPTCHA IMAGE

// Load the image
Jimp.read('https://i.ibb.co/R4BB4DW/Captcha-Bajaj.jpg')
  .then(img => {
    // Preprocess the image
    img.greyscale()
       .invert()
       .threshold({max:128})
       .gaussian(2);
       

    // Detect the lines
    const lines = img.scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y, idx) => {
      if (img.bitmap.data[idx] === 0) {
        return 0xFFFFFFFF; // Set the pixel to white
      }
      return img.bitmap.data[idx];
    })

    //converting to Array
    const arr=Array.from(lines)

    // Remove the lines
    arr.forEach((line) => {
      img.scan(line.x, line.y, line.width, line.height, (x, y, idx) => {
        img.bmp.data[idx] = 255;
      })
      
    });
    // Pass the image to Tesseract
    Tesseract.recognize(img.bitmap)
             .then(result => {
               console.log(result.text);
             });
  })
  .catch(err => {
    console.error(err);
  });
