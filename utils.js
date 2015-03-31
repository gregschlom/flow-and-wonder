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
