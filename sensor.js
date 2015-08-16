Sensor = function(sensorInterface) {	
	this.sensorInterface = sensorInterface
}

Sensor.prototype.isActive = function() {
	return this.sensorInterface.last != undefined && this.sensorInterface.cur != undefined
}

Sensor.prototype.currentPosition = function() {
	if (this.isActive()) {
		return new THREE.Vector3(this.sensorInterface.cur.x, this.sensorInterface.cur.y, 0)
	} else {
		return undefined
	}
}

Sensor.prototype.previousPosition = function() {
	if (this.isActive()) {
		return new THREE.Vector3(this.sensorInterface.last.x, this.sensorInterface.last.y, 0)
	} else {
		return undefined
	}
}