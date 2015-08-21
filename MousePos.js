MousePos = function(element, camera, scene, shift)
{
    this.raycaster = new THREE.Raycaster();
    this.camera = camera;
    this.scene = scene;
    this.last = this.cur = undefined;
    this.shift = shift    

    var obj = this;
    element.addEventListener('mousedown', function(event) { obj.onMouseDown(event); }, false);
    element.addEventListener('touchstart', function(event) { obj.touchstart(event); }, false);
    element.addEventListener('touchend', function(event) { obj.touchend(event); }, false);
    element.addEventListener('touchmove', function(event) { obj.touchmove(event); }, false);
};

MousePos.prototype.onMouseDown = function(event) {        
    if (event.button === THREE.MOUSE.LEFT) {
        
        if (this.shift) {
            if (event.shiftKey) {
                this.last = this.cur = this.getMousePos(event);
            }
        } else {
            this.last = this.cur = this.getMousePos(event);
        }        
        
        var obj = this;
        this.mouseMoveHandler = function(event) { obj.onMouseMove(event); }
        this.mouseUpHandler = function(event) { obj.onMouseUp(event); }

        document.addEventListener('mousemove', this.mouseMoveHandler, false);
        document.addEventListener('mouseup', this.mouseUpHandler, false);
    }
}

MousePos.prototype.onMouseMove = function (event) {        
        event.preventDefault();

        if (this.shift) {
            if (event.shiftKey) {
                this.last = this.cur;
                this.cur = this.getMousePos(event);    
            }
        } else {
            this.last = this.cur;
            this.cur = this.getMousePos(event);
        }
}

MousePos.prototype.onMouseUp = function (event) {        
    this.last = this.cur = undefined;
    var obj = this;
    document.removeEventListener('mousemove', this.mouseMoveHandler, false);
    document.removeEventListener('mouseup', this.mouseUpHandler, false);
}

MousePos.prototype.touchstart = function (event) {
    if (event.touches.length == 1) {
        this.last = this.cur = this.getMousePos(event);
    }
}

MousePos.prototype.touchmove = function (event) {       
    event.preventDefault();

    if (event.touches.length == 1) {
        this.last = this.cur;
        this.cur = this.getMousePos(event);
        event.stopPropagation();
    }
}

MousePos.prototype.touchend = function () {        
    this.last = this.cur = undefined;
}

MousePos.prototype.getMousePos = function (event) {        
    var x = (event.clientX) ? event.clientX : event.touches[0].pageX;
    var y = (event.clientY) ? event.clientY : event.touches[0].pageY;

    var mouse = new THREE.Vector2(
        (x / window.innerWidth) * 2 - 1,
       -(y / window.innerHeight) * 2 + 1);

    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(mouse, this.camera);

    // calculate object intersecting the picking ray
    var intersects = this.raycaster.intersectObject(this.scene.mushroom);
    var point = intersects[0].point;

    return new THREE.Vector2(point.x, point.z);
}

