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
    renderer.setClearColor(new THREE.Color(0x090912, 1));
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
    this.geometry.hex = new Array();
    this.geometry.radius = 18;
    var numLEDs = HexCoord.cellCountInRadius(this.geometry.radius);

    for (var i = 0; i < numLEDs; i++) {
        var h = HexCoord.fromSpiral(i);
        var pos = h.position();
        pos.normalize().multiplyScalar(h.polarRadius() / this.geometry.radius);

        this.geometry.vertices.push(new THREE.Vector3(pos.x, 0, pos.y));

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

    this.scene.add(new THREE.PointCloud(this.geometry, material));

    this.frame = 0;
    Scene.instance = this;
};

Scene.prototype = {
    render: function() {},

    _render: function() {
        var self = Scene.instance;
        self.stats.begin();
        requestAnimationFrame(self._render);

        self.render(self.frame, 0, self.geometry);

        self.frame++;

        self.controls.update();
        self.renderer.render(self.scene, self.camera);
        self.stats.end();
    },

    start: function() {
        this._render();
    }
};


