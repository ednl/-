const TORAD = Math.PI / 180;

const MINSIZE =  1;
const MAXSIZE = 50;
const DEFSIZE = 10;

const MINCOUNT =  100;
const MAXCOUNT = 1000;
const DEFCOUNT =  500;

// Divide by 100
const MINPITCH =   1;
const MAXPITCH = 360;
const DEFPITCH = 180;

// Divide by 1000
const MINSPEED = -100;
const MAXSPEED =  100;
const DEFSPEED =    3;

const DEFANGLE = 135;

let size, count, pitch, speed, half, angle;  // UI
let divLink, divAngle;
let isMoving = true;

function makeLink() {
	const q = new QueryString({
		s: size.value(),
		c: count.value(),
		p: floor(pitch.value() * 100),
		w: floor(speed.value() * 1000),
		a: DEFANGLE
	});
	divLink.html('<a href="' + q.toHtml() + '">share</a>');
}

function getDimension() {
	return max(100, min(windowWidth, windowHeight - 30));
}

function getSliderWidth(canvaswidth) {
	return (canvaswidth - 20) / 4;
}

function resizeUI(dim) {
	const sw = getSliderWidth(dim);
	size.style('width', sw + 'px');
	count.style('width', sw + 'px');
	pitch.style('width', sw + 'px');
	speed.style('width', sw + 'px');
	half = dim / 2;
}

function windowResized() {
	const dim = getDimension();
	resizeCanvas(dim, dim);
	resizeUI(dim);
}

function mousePressed() {
	if (mouseX >= 10 && mouseY >= 10 && mouseX < width - 10 && mouseY < height - 20) {
		isMoving = !isMoving;
		return false;
	}
}

function setup() {
	const q = new QueryString();

	let intSize = q.getInt('s');
	intSize = isNaN(intSize) ? DEFSIZE : max(MINSIZE, min(MAXSIZE, intSize));

	let intCount = q.getInt('c');
	intCount = isNaN(intCount) ? DEFCOUNT : max(MINCOUNT, min(MAXCOUNT, intCount));

	let intPitch = q.getInt('p');
	intPitch = isNaN(intPitch) ? DEFPITCH : max(MINPITCH, min(MAXPITCH, intPitch));

	let intSpeed = q.getInt('w');
	intSpeed = isNaN(intSpeed) ? DEFSPEED : max(MINSPEED, min(MAXSPEED, intSpeed));

	let intAngle = q.getInt('a');
	intAngle = isNaN(intAngle) ? DEFANGLE : intAngle % 360;
	while (intAngle < 0) {
		intAngle += 360;
	}

	const dim = getDimension();
	createCanvas(dim, dim);

	size  = createSlider(MINSIZE, MAXSIZE, intSize);
	size.alt = 'Size';
	count = createSlider(MINCOUNT, MAXCOUNT, intCount);
	pitch = createSlider(MINPITCH / 100, MAXPITCH / 100, intPitch / 100, 0.01);
	speed = createSlider(MINSPEED / 1000, MAXSPEED / 1000, intSpeed / 1000, 0.001);
	angle = intAngle;

	divAngle = createDiv();
	divAngle.style('font-family', 'Calibri, Arial, sans-serif');
	divAngle.style('font-size', '16px');
	divAngle.position(6, 4);

	divLink = createDiv();
	divLink.style('font-family', 'Calibri, Arial, sans-serif');
	divLink.style('font-size', '16px');
	divLink.position(6, 24);
	makeLink();

	size.changed(makeLink);
	count.changed(makeLink);
	pitch.changed(makeLink);
	speed.changed(makeLink);

	resizeUI(dim);
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
	const da = angle * TORAD;
	let a = 0, r = 0;          // angle & radius per seed

	// Print the next-seed-angle in degrees with 2 decimal places
	divAngle.html(angle.toFixed(2) + '&deg;');

	push();
	translate(half, half);     // origin in the middle
	scale(1, -1);              // make sin() go the right way
	stroke(0, 0, 0, 0.2);      // soft outline
	background(0, 0, 100, 1);  // white background
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
		a += da;
		r += dr;
	}
	pop();

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
