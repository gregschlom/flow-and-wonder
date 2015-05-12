MousePos = function(element, camera, scene)
{
    this.raycaster = new THREE.Raycaster();
    this.camera = camera;
    this.scene = scene;
    this.last = this.cur = undefined;
    MousePos.instance = this;

    element.addEventListener('mousedown', this.onMouseDown, false);
    element.addEventListener('touchstart', this.touchstart, false);
    element.addEventListener('touchend', this.touchend, false);
    element.addEventListener('touchmove', this.touchmove, false);
};

MousePos.prototype = {

    onMouseDown: function (event) {
        var self = MousePos.instance;
        if (event.button === THREE.MOUSE.LEFT) {

            self.last = self.cur = self.getMousePos(event);

            document.addEventListener('mousemove', self.onMouseMove, false);
            document.addEventListener('mouseup', self.onMouseUp, false);
        }
    },

    onMouseMove: function (event) {
        var self = MousePos.instance;
        event.preventDefault();

        self.last = self.cur;
        self.cur = self.getMousePos(event);
    },

    onMouseUp: function (event) {
        var self = MousePos.instance;
        self.last = self.cur = self.undefined;

        document.removeEventListener('mousemove', self.onMouseMove, false);
        document.removeEventListener('mouseup', self.onMouseUp, false);
    },

    touchstart: function (event) {
        var self = MousePos.instance;
        if (event.touches.length == 1) {
            self.last = self.cur = self.getMousePos(event);
        }
    },

    touchmove: function (event) {
        var self = MousePos.instance;
        event.preventDefault();

        if (event.touches.length == 1) {
            self.last = self.cur;
            self.cur = self.getMousePos(event);
            event.stopPropagation();
        }
    },

    touchend: function () {
        var self = MousePos.instance;
        self.last = self.cur = undefined;
    },

    getMousePos: function (event) {
        var self = MousePos.instance;

        var x = (event.clientX) ? event.clientX : event.touches[0].pageX;
        var y = (event.clientY) ? event.clientY : event.touches[0].pageY;

        var mouse = new THREE.Vector2(
            (x / window.innerWidth) * 2 - 1,
           -(y / window.innerHeight) * 2 + 1);

        // update the picking ray with the camera and mouse position
        self.raycaster.setFromCamera(mouse, self.camera);

        // calculate object intersecting the picking ray
        var intersects = self.raycaster.intersectObject(self.scene.mushroom);
        var point = intersects[0].point;

        return new THREE.Vector2(point.x, point.z);
    }
};
