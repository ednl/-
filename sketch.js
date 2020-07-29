const TORAD = Math.PI / 180;

let size, count, pitch, speed, half;
let angle = 180;
let isMoving = true;

function getDimension() {
	return max(100, min(windowWidth, windowHeight - 30));
}

function getSliderWidth(canvaswidth) {
	return (canvaswidth - 20) / 4;
}

function windowResized() {
	const dim = getDimension();
	resizeCanvas(dim, dim);
	half = dim / 2;

	const sw = getSliderWidth(dim);
	size.style('width', sw + 'px');
	count.style('width', sw + 'px');
	pitch.style('width', sw + 'px');
	speed.style('width', sw + 'px');
}

function mousePressed() {
	if (mouseX >= 10 && mouseY >= 10 && mouseX < width - 10 && mouseY < height - 20) {
		isMoving = !isMoving;
		return false;
	}
}

function setup() {
	createCanvas(100, 100);
	size  = createSlider(1, 50, 20);
	count = createSlider(100, 1000, 500);
	pitch = createSlider(0.01, 2, 1, 0.01);
	speed = createSlider(-0.1, 0.1, 0.02, 0.001);
	windowResized();

	colorMode(HSB);
	strokeWeight(1);
	noStroke();
	fill(0);
	textSize(16);
	textAlign(RIGHT, BOTTOM);
}

function draw() {
	// Complete every draw loop with consistent settings
	const maxsize = size.value() * 10;
	const num = count.value();
	const dr = pitch.value();
	const omega = speed.value();

	push();
	translate(half, half);   // origin in the middle
	scale(1, -1);              // make sin() go the right way
	stroke(0, 0, 0, 0.2);      // soft outline
	background(0, 0, 100, 1);  // white background
	let a = 0, r = 0;          // angle,radius per seed
	for (let n = 0; n < num; ++n) {
		// Hue from red to not-quite-back-to-red
		const rainbow = map(r, 0, half, 0, 250);
		fill(rainbow, 100, 100, 0.8);

		// Draw the seed
		const x = r * cos(a);
		const y = r * sin(a);
		const diam = map(r, 0, half, 10, maxsize);
		circle(x, y, diam);

		// Go to the next seed
		a += angle * TORAD;
		r += dr;
	}
	pop();

	// Print the next-seed-angle in degrees with 2 decimal places
	text(angle.toFixed(2), width - 6, height - 4);

	if (isMoving) {
		// Slightly different angle for the next draw loop
		angle += omega;
		if (angle >= 360) {
			angle -= 360;
		} else if (angle < 0) {
			angle += 360;
		}
	}
}
