var palette1 = [new THREE.Color("rgb(226,201,245)"),
				new THREE.Color("rgb(168,205,247)"),
				new THREE.Color("rgb(135,181,224)"),
				new THREE.Color("rgb(167,244,247)"),
				new THREE.Color("rgb(0,255,170)")];

var palette2 = [new THREE.Color("rgb(63,184,175)"),
				new THREE.Color("rgb(127,199,175)"),
				new THREE.Color("rgb(218,216,167)"),
				new THREE.Color("rgb(255,158,157)"),
				new THREE.Color("rgb(255,61,127)")];

var tychoPalette = [new THREE.Color("rgb(211,132,91)"),
					new THREE.Color("rgb(212,121,100)"),
					new THREE.Color("rgb(183,106,98)"),
					new THREE.Color("rgb(209,115,131)"),
					new THREE.Color("rgb(170,97,124)"),
					new THREE.Color("rgb(163,109,143)"),
					new THREE.Color("rgb(118,109,136)"),
					new THREE.Color("rgb(49,61,43)")];

function colorSample(time) {
	var palette = tychoPalette;	
	var numColors = palette.length;

	var timeIntegerPart = Math.floor(time);
	var timeDecimalPart = time - Math.floor(time);	

	var index = timeIntegerPart.mod(numColors);

	var color1 = palette[index];
	var color2 = palette[ (index + 1).mod(numColors) ];

	var color = color1.clone();
	color.lerp(color2, timeDecimalPart);
	return color;
}