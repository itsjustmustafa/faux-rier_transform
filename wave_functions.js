function sinWave(amp, freq, phase){ //returns a sin function, given an amp, frequency, and phase
	return(function(x){
		return(amp*Math.sin(freq*x + phase))
	});
}

function polar_to_cart(r, theta){//given a polar point, returns [x,y] as the cartesian equivalent point
	return([r*Math.cos(theta), r*Math.sin(theta)]);
}

function normArr(arr, norm){//given an array of numbers, scales each entry down so it sums to 'norm'
	sum = sumArr(arr);
	newArr = []
	for(let i = 0; i<arr.length; i++){
		newArr[i] = arr[i]*norm/sum;
	}

	return(newArr);
}

function sumArr(arr){//sums the values of a number-populated array
	sum = 0;
	for(s of arr){
		sum += s;
	}
	return(sum);
}

function sumWaves(waves, x){//a function where, given an array of mathematical functions, returns the sum of the functions with argument 'x'
	sum=0;
	for(w of waves){
		sum += w(x);
	}
	return(sum);
}