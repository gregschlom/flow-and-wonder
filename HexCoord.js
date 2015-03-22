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

    // Multiply by a scalar - truncates to integer coordinates
    scale: function (s)
    {
        this.q = Math.trunc(this.q * s);
        this.r *= Math.trunc(this.r * s);

        return this;
    },

    // Return a THREE.Vector2 with the position of the center of this hex
    position: function()
    { 
        return new THREE.Vector2(
            Math.sqrt(3) * (this.q + this.r / 2),
            this.r * 1.5 );
    },

    /// Get the maximum absolute cubic coordinate.
    /// In hexagonal space this is the polar radius, i.e. distance from 0,0.
    polarRadius: function()
    {
        return Math.max(Math.abs(this.q), Math.abs(this.r), Math.abs(this.q + this.r));
    },

    /// Get the counterclockwise position of this hex in the ring at its distance from 0,0.
    polarIndex: function()
    {
        if (this.q == 0 && this.r == 0) return 0;
        if (this.q > 0 && this.r >= 0) return this.r;
        if (this.q <= 0 && this.r > 0) return (-this.q < this.r) ? this.r - this.q : -3 * this.q - this.r;
        if (this.q < 0) return -4 * (this.q + r) + this.q;
        return (-this.r > this.q) ? -4 * this.r + this.q : 6 * this.q + this.r;
    }
};

//////////////// Static methods \\\\\\\\\\\\\\\\\\\\\\

HexCoord.origin = new HexCoord(0, 0);

// HexCoords from hexagonal polar coordinates.
// Hexagonal polar coordinates approximate a circle to a hexagonal ring.
//
// radius: Hex distance from (0,0).
// index: Counterclockwise index, starting from 0 (on the positive q axis).
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


/// HexCoord from spiral coordinates. `index` = 0 is the center of the spiral, and it
/// grows counter-clockwise from 3 o'clock.
HexCoord.fromSpiral = function(index)
{
    // A hex ring of radius 'r' has 6*r cells if r >= 1, and 1 cell if r = 0.
    // Therefore, a hex disc of radius 'r' has: 1 + 6*1 + 6*2 + ... + 6*r cells
    // <=> 1 + 6 * r(r+1)/2  <=>  1 + 3r(r+1)
    //
    // So the largest index in an hex disc of radius 'r' is index = 3r(r+1)
    // Solving for r, we have:

    var radius = Math.ceil((Math.sqrt(9 + 12 * index) - 3) / 6);
    if (index > 0) index -= 3 * (radius - 1) * radius + 1;
    return HexCoord.fromPolar(radius, index);
}

