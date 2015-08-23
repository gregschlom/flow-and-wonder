Math.TAU = Math.PI * 2;

// Fix the js modulo bug
// See: http://javascript.about.com/od/problemsolving/a/modulobug.htm
Number.prototype.mod = function(n)
{
    return ((this % n) + n) % n;
}

// trunc is defined in ECMAScript 6 - fix for older browsers
Math.trunc = function (a)
{
    return (a >= 0) ? Math.floor(a) : Math.ceil(a);
}

Number.prototype.clamp = function(min, max)
{
    return Math.min(Math.max(this, min), max);
};

/*
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 * from: http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIntExcluding(min, max, except) {

	if (except > min && except < max) {
		var bucket1 = getRandomInt(min, except-1);
		var bucket2 = getRandomInt(except+1, max)

		if (getRandomInt(0,1) % 2 == 0) {
			return bucket1;
		} else {
			return bucket2;
		}
	}

	else if (except == min) {
		return getRandomInt(except+1, max);
	}

	else if (except == max) {
		return getRandomInt(min, except-1);
	}

	else if (except > max || except < min) {
		return getRandomInt(min,max);
	}

}

function distanceFromCenter(x, y) {
    return distanceFromPoint(x,y,0,0);
}

function distanceFromPoint(x, y, x0, y0) {
    return Math.sqrt(Math.pow(x-x0,2) + Math.pow(y-y0,2));
}

function sawtooth(time) {
    return time - Math.floor(time);
}

function map(value, in_min, in_max, out_min, out_max) {
	return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}