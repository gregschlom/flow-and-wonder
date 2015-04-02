function createStats() {
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
    return stats;
}

function createRenderer()
{
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(.1,.1,.1));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
}

Scene = function()
{
    // Set up FPS counter
    this.stats = createStats();

    // Set up the renderer
    this.renderer = createRenderer();

    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 3, 2);
    this.scene.add(this.camera);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE /*, PAN: THREE.MOUSE.LEFT */ };


    // LEDs (particles)
    this.geometry = new THREE.Geometry();
    this.geometry.state = new Array()
    this.geometry.hex = new Array();
    this.geometry.radius = 18;
    var numLEDs = HexCoord.cellCountInRadius(this.geometry.radius);

    for (var i = 0; i < numLEDs; i++) {
        var h = HexCoord.fromSpiral(i);
        var pos = h.position();
        //pos.normalize().multiplyScalar(h.polarRadius() / this.geometry.radius);
        pos.multiplyScalar(.033);

        this.geometry.vertices.push(new THREE.Vector3(pos.x, 0, pos.y));
        this.geometry.state.push({'vpos': pos});

        // Preset some color (optional)
        var color = new THREE.Color();
        color.setHSL(h.polarRadius() / this.geometry.radius, 1, .5);

        this.geometry.colors.push(color);
        this.geometry.hex.push(h);
    }

    var material = new THREE.ShaderMaterial({
        vertexColors: THREE.VertexColors,
        vertexShader:
            "varying vec3 vColor;" +
            "void main() {" +
            "    vColor = color;" +
            "    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);" +
            "    gl_PointSize = 10.0;" +
            "    gl_Position = projectionMatrix * mvPosition;" +
            "}",

        fragmentShader:
            "varying vec3 vColor;" +
            "void main() {" +
            "    float alpha = (.5 - clamp(distance(gl_PointCoord, vec2(.5,.5)), 0.0, .5)) * 2.0;" +
            "    if (alpha < .3) discard;" +
            "    gl_FragColor = vec4(vColor, alpha);" +
            "}",
        transparent: true
    });

    this.leds = new THREE.PointCloud(this.geometry, material);
    this.scene.add(this.leds);

    this.frame = 0;
    Scene.instance = this;
};

Scene.prototype = {

    // Update the global state, once per frame
    update: function(frame) {},

    // Compute the color of each led
    // r: radius normalized in [0, 1]
    // a: angle in radians [0, 2π]
    computeColorPolar: function(r, a, frame) { return THREE.ColorKeywords.pink },

    // return the color at a given x,y coordinate
    // x and y are normalized in [-1, 1].
    computeColor: function(x, y, frame, state) { return THREE.ColorKeywords.pink },

    _render: function() {
        var self = Scene.instance;
        self.stats.begin();
        requestAnimationFrame(self._render);

        self.update(self.frame);

        // Compute the color of each led
        for (var i = 0; i < self.geometry.vertices.length; i++) {
            var pos = self.geometry.vertices[i];
            var hex = self.geometry.hex[i];

            //var r = hex.polarRadius() / self.geometry.radius;
            //var a = Math.TAU * hex.polarIndex() / (6 * hex.polarRadius());
            //self.geometry.colors[i] = self.computeColorPolar(r, a, self.frame);
            self.geometry.colors[i] = self.computeColor(pos.x, pos.z, self.frame, self.geometry.state[i]);
        }

        self.geometry.colorsNeedUpdate = true;

        self.frame++;

        self.controls.update();
        self.renderer.render(self.scene, self.camera);
        self.stats.end();
    },

    start: function() {
        this._render();
    }
};


