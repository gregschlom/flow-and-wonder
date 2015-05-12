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
    renderer.setClearColor(new THREE.Color(0x0e0b1a));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
}

Scene = function()
{
    var self = this;

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


    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( 1, 1, 0 );
    this.scene.add( directionalLight );


    var transform = new THREE.Matrix4();
    transform.makeRotationX(-Math.PI/2).scale(new THREE.Vector3(.008,.008,.008));

    var loader = new THREE.JSONLoader();

    loader.load(
        // resource URL
        'models/mushroom.json',
        function ( geometry, materials ) {
            var material = new THREE.MeshLambertMaterial({ color: 0x64622a, side: THREE.DoubleSide });
            geometry.applyMatrix(transform);
            self.mushroom = new THREE.Mesh(geometry, material);
            self.scene.add(self.mushroom);
        }
    );

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
        transparent: true,
        //depthWrite: false,
        //depthTest: false
    });


    loader.load(
        // resource URL
        'models/leds.json',
        function ( geometry, materials ) {
            geometry.applyMatrix(transform);
            geometry.applyMatrix(new THREE.Matrix4().makeScale(1.01, 1.01, 1.01));

            geometry.state = new Array();

            for (var i = 0; i < geometry.vertices.length; i++) {
                var pos = geometry.vertices[i];
                geometry.state.push({'vpos': new THREE.Vector2(pos.x, pos.z)});
            }

            self.leds = geometry;
            self.scene.add(new THREE.PointCloud(geometry, material))
        }
    );

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

        // Wait until the leds are loaded
        if (!self.leds) return;

        self.update(self.frame);

        // Compute the color of each led
        for (var i = 0; i < self.leds.vertices.length; i++) {
            var pos = self.leds.vertices[i];
            self.leds.colors[i] = self.computeColor(pos.x, pos.z, self.frame, self.leds.state[i]);
        }

        self.leds.colorsNeedUpdate = true;

        self.frame++;

        self.controls.update();
        self.renderer.render(self.scene, self.camera);
        self.stats.end();
    },

    start: function() {
        this._render();
    }
};


