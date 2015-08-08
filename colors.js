var palette1 = [new THREE.Color("rgb(226,201,245)"),
				new THREE.Color("rgb(168,205,247)"),
				new THREE.Color("rgb(135,181,224)"),
				new THREE.Color("rgb(167,244,247)"),
				new THREE.Color("rgb(0,255,170)")];

//http://www.colourlovers.com/palette/932683/Compatible
var palette2 = [new THREE.Color("rgb(63,184,175)"),
				new THREE.Color("rgb(127,199,175)"),
				new THREE.Color("rgb(218,216,167)"),
				new THREE.Color("rgb(255,158,157)"),
				new THREE.Color("rgb(255,61,127)")];

var palette3 = [new THREE.Color("rgb(235,255,254)"),
				new THREE.Color("rgb(185,237,235)"),
				new THREE.Color("rgb(140,194,191)"),
				new THREE.Color("rgb(108,158,156)"),
				new THREE.Color("rgb(46,117,114)")];

var bw = [new THREE.Color("rgb(255,255,255)"),
		  new THREE.Color("rgb(0,0,0)")];

var tychoPalette = [new THREE.Color("rgb(211,132,91)"),
					new THREE.Color("rgb(212,121,100)"),
					new THREE.Color("rgb(183,106,98)"),
					new THREE.Color("rgb(209,115,131)"),
					new THREE.Color("rgb(170,97,124)"),
					new THREE.Color("rgb(163,109,143)"),
					new THREE.Color("rgb(118,109,136)"),
					new THREE.Color("rgb(49,61,43)")];

//http://www.colourlovers.com/palette/919419/An_Old_Friend
var lacostePalette = [new THREE.Color("rgb(182,216,192)"),
					  new THREE.Color("rgb(200,217,191)"),
					  new THREE.Color("rgb(218,218,189)"),
					  new THREE.Color("rgb(236,219,188)"),
					  new THREE.Color("rgb(254,220,186)")];

//http://www.colourlovers.com/palette/1811244/1001_Stories
var stories = [new THREE.Color("rgb(248,117,149)"),
			   new THREE.Color("rgb(246,114,128)"),
			   new THREE.Color("rgb(192,108,132)"),
			   new THREE.Color("rgb(108,91,123)"),
			   new THREE.Color("rgb(53,92,125)")];

function colorSample(time, paletteIndex) {

	var palette;	
	if (paletteIndex == 0) {
		palette = palette1;
	}
	else if (paletteIndex == 1) {
		palette = palette2;
	}
	else if (paletteIndex == 2) {
		palette = bw;
	}
	else if (paletteIndex == 3) {
		palette = tychoPalette;
	}
	else if (paletteIndex == 4) {
		palette = stories;
	}
	
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