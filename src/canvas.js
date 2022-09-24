import Dot from "./js/dot.js";

console.log();
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const img = document.querySelector("img");
const radius = 300;
let isImage = false;

canvas.width = innerWidth;
canvas.height = innerHeight;

//how we animate our circle
function animateDot(dot, canvas) {
  //rand here will be how our circle is drawn with the pixels
  const rand = Math.random() * Math.PI * 2;

  let x = Math.sin(rand) * radius + canvas.width / 2;
  let y = Math.cos(rand) * radius + canvas.height / 2;
  if (isImage) {
    x = dot.imageX;
    y = dot.imageY;
  }

  //gsap https://greensock.com/get-started/
  gsap.to(dot, {
    //how fast the pixels move
    duration: 1.75 + Math.random(),

    //creates our random pixel circle
    x,
    y,

    //gsap animation
    ease: "cubic.inOut",

    //animation
    onComplete: () => {
      animateDot(dot, canvas);
    },
  });
}

addEventListener("click", () => {
  isImage = !isImage;
});

addEventListener("load", () => {
  c.drawImage(img, 0, 0);
  //how we get split the image into data
  const imageData = c.getImageData(
    0,
    0,
    img.naturalWidth,
    img.naturalHeight
  ).data;

  const dots = [];
  const pixels = [];

  for (let i = 0; i < imageData.length; i += 4) {
    //guard here will get rid of all black out of png images
    if (imageData[i] === 0) {
      continue;
    }

    //code to get our pixel.x and pixel.y of
    const x = (i / 4) % img.naturalWidth;
    const y = Math.floor(Math.floor(i / img.naturalWidth) / 4);

    //speeds the animation up
    if (x % 5 === 0 && y % 5 === 0) {
      //getting the data imagedata into a new array
      pixels.push({
        x,
        y,
        r: imageData[i],
        g: imageData[i + 1],
        b: imageData[i + 2],
      });
    }
  }

  //creating the pixels from the image
  pixels.forEach((pixel, i) => {
    // how to center our image
    const imageX = pixel.x + canvas.width / 2 - img.naturalWidth / 2;
    const imageY = pixel.y + canvas.height / 2 - img.naturalHeight / 2;

    //creating a circle with the pixel
    let rand = Math.random() * Math.PI * 2;
    const x = Math.sin(rand) * radius + canvas.width / 2;
    const y = Math.cos(rand) * radius + canvas.height / 2;

    dots.push(new Dot(x, y, pixel.r, pixel.g, pixel.b, imageX, imageY));

    animateDot(dots[i], canvas);
  });

  //loop for animation
  function animate() {
    requestAnimationFrame(animate);

    //clearing the canvas for looping
    c.clearRect(0, 0, innerWidth, innerHeight);

    //draw function that prints the dots to the canvas
    dots.forEach((dot) => {
      dot.draw(c);
    });
  }

  animate();
});
