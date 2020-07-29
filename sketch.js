let count, size, pitch, speed;
let angle = 180;
const TORAD = Math.PI / 180;

function setup() {
  createCanvas(815, 815);
  colorMode(HSB);
  strokeWeight(1);
  noStroke();
  fill(0);
  textSize(16);
  textAlign(RIGHT, BOTTOM);
  
  size  = createSlider(1, 50, 20);
  count = createSlider(100, 1000, 500);
  pitch = createSlider(0.01, 2, 1, 0.01);
  speed = createSlider(-0.1, 0.1, 0.02, 0.001);
  size.style('width', '200px');
  count.style('width', '200px');
  pitch.style('width', '200px');
  speed.style('width', '200px');
}

function draw() {
  const dr = pitch.value();
  const s = size.value() * 10;
  const w = width / 2;
  let a = 0, r = 0;
  
  push();
  translate (w, height / 2);
  scale(1, -1);
  stroke(0, 0, 0, 0.2);
  background(0, 0, 100, 1);
  
  for (let n = 0; n < count.value(); ++n) {
    fill(map(r, 0, w, 0, 300), 100, 100, 0.8);
    const x = r * cos(a);
    const y = r * sin(a);
    const d = map(r, 0, w, 10, s);
    circle(x, y, d);
    a += angle * TORAD;
    r += dr;
  }
  pop();
  
  text(angle.toFixed(2), width - 6, height - 4);
  
  angle += speed.value();
  if (angle >= 360) {
    angle = 0;
  } else if (angle <= 0) {
    angle = 360;
  }
}
