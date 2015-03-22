HexCoord = function (q, r)
{

    this.q = q || 0;
    this.r = r || 0;
};

HexCoord.prototype = {

    constructor: HexCoord,

    set: function (q, r)
    {
        this.q = q;
        this.r = r;
 
        return this;
    },

    equals: function (h)
    {
        return ((h.q === this.q) && (h.r === this.r));
    },

    add: function (h)
    {
        this.q += h.q;
        this.r += h.r;

        return this;
    },

    sub: function (h)
    {
        this.q -= h.q;
        this.r -= h.r;

        return this;
    },

    scale: function (s)
    {
        this.q = Math.trunc(this.q * s);
        this.r *= Math.trunc(this.r * s);

        return this;
    }
};

//////////////// Static methods \\\\\\\\\\\\\\\\\\\\\\

HexCoord.origin = new HexCoord(0, 0);

/// HexCoords from hexagonal polar coordinates.
/// Hexagonal polar coordinates approximate a circle to a hexagonal ring.
/// radius: Hex distance from 0,0.
/// index: Counterclockwise index.
HexCoord.fromPolar = function(radius, index)
{
    radius = Math.abs(radius);
    if (radius == 0) return HexCoord.origin;
    
    index = index.mod(radius * 6);         // Make sure index is [0 - radius*6]
    var sextant = Math.trunc(index / radius);
    index %= radius;

    switch (sextant)
    {
        case 0: return new HexCoord(radius - index, index);
        case 1: return new HexCoord(-index, radius);
        case 2: return new HexCoord(-radius, radius - index);
        case 3: return new HexCoord(index - radius, -index);
        case 4: return new HexCoord(index, -radius);
        case 5: return new HexCoord(radius, index - radius);
        default: throw new Error("this should not happen");
    }
}

