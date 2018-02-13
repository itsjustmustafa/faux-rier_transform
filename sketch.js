function setup(){
	createCanvas(500, 400);
	background(51);
	noStroke();
	textSize(20);
}

let waveHeight = 50;//the max heigth of the wave (to which the summed wave is normalized to)

//Equation is as follows : amp * sin(freq * x + phase)

//below is the ordered list of the amps, frequencies, and phases
let amp = [3, 2.5, 2, 4, 3, 2.5, 2, 4];
let freq = [1, 2, 3, 4, 5, 6, 7, 8];
let phase = [0, 0, 0, 0, 0, 0, 0, 0];
let normAmp = normArr(amp, waveHeight);//normalizes so sum of amp is waveHeight
let xScale = 0.1; //the increment in the x direction of the curve
let wave = []; //each entry in this is to be populated with a function corresponding to each sin wave from entries in the above arrays

let eqString = ""; //this is the equation as a string, eg. "3sin(4x + 0.4) + 5sin(0.5x + 1)"

for(let i = 0; i<amp.length; i++){
	if(amp[i] && freq[i]){ //if the amp and freq is not 0, this is a valid curve equation
		if(i>0){
			eqString += " +";
		}
		eqString += amp[i]+"sin("+freq[i]+"x";
		if(phase[i]){
			if(phase[i]>0){
				eqString += '+'+phase[i];
			}else{
				eqString += phase[i];	
			}
		}
		eqString += ") "
	}
}



for(let i = 0; i<amp.length; i++){
	wave[i] = sinWave(normAmp[i], freq[i], phase[i]);//the array is populated with the sin function
}

pad = 10; //aesthetic padding
let xDetail = 300;//the scope of the x variable

currF = 0;//this is the wrapping frequency, which is incremented (this is scaled by fDelta)

fRange = 12;//the wrapping frequency range
totalFreqs = 1200;//the number of frequencies at which the curve is wrapped between 0 and fRange
fDelta = fRange/totalFreqs;//the rate of the increment of currF

xSpectrum = [];//an array of the points in the fourier transform (x-axis)
ySpectrum = [];//an array of the points in the fourier transform (y-axis)

let rotations = 1;//how many times we are wrapping the curve around

spectrumScale = 25;//the number by which the height of the final spectrum will be divided by

function draw(){//the main loop in a p5.js sketch
	background(51);

	fill(255);
	noStroke();

	text(eqString, pad, 2*(waveHeight+pad), width - pad*2, 100);
	
	noFill();
	stroke(255);
	rect(pad/2, pad/2, width-pad, 2*waveHeight +pad);

	beginShape(); //this begins the shape of the sinusoidal wave at the top of the sketch
	for(let i = 0; i<xDetail; i++){
		xPos = map(i, 0, xDetail, pad, width-pad);

		vertex(xPos, (-1)*sumWaves(wave,(i*xScale)) +  waveHeight + pad);
	}
	endShape();

	
	translate(100+pad/2, 300-pad/2);
	fill(100);
	rect(-100, -100, 2*100, 2*100);
	point(0,0);
	noFill();



	
	xWavePoints = [];//the array of the points in the polar graph (x-axis)
	yWavePoints = [];//the array of the points in the polar graph (y-axis)

	beginShape();//begins the polar curve shape
	for(let ang = 0; ang<xDetail*rotations; ang++){
		[xPos, yPos] = polar_to_cart(sumWaves(wave,(ang*xScale)), ang*xScale*currF*fDelta);
		vertex(xPos, yPos);
		xWavePoints.push(xPos/rotations);
		yWavePoints.push(yPos/rotations);
	}
	endShape();

	//this is the "centre of mass", so to speak, of the polar graph
	noStroke();
	fill(0,0,0);
	ellipse(4*sumArr(xWavePoints)/xWavePoints.length, 4*sumArr(yWavePoints)/yWavePoints.length, 4);
	noFill();
	stroke(255);

	currF = currF+1;//increment the currF
	if(currF*fDelta>fRange){
		currF = 0;
	}

	ySpectrum[currF] = (sumArr(yWavePoints)/spectrumScale);
	xSpectrum[currF] = (sumArr(xWavePoints)/spectrumScale);


	resetMatrix();

	translate(200 + pad, 300+pad);

	//showing the y-axis component of the spectrum

	stroke(255, 200, 200);
	beginShape();
	for(i=0; i<ySpectrum.length; i++){
		xPos = map(i, 0, totalFreqs, 0, 300-2*pad);
		vertex(xPos, (-1)*(ySpectrum[i]));
	}
	endShape();


	//showing the x-axis component of the spectrum

	// stroke(200, 255, 200);
	// beginShape();
	// for(i=0; i<xSpectrum.length; i++){
	// 	xPos = map(i, 0, totalFreqs, 0, 300-2*pad);
	// 	vertex(xPos, (-1)*xSpectrum[i]);
	// }
	// endShape();

}