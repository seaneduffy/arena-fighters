let Sprite = require('./sprite'),
	settings = require('./settings'),
	GameObject = require('./gameObject');

function Bullet(serverState, stateLabel) {
	GameObject.prototype.constructor.call(this, settings.zBullet, stateLabel);
	this.addSprite(settings.bulletSprite, new Sprite(settings.bulletSprite));
	if(!!serverState)
		this.state = serverState;
}

Bullet.prototype = Object.create(GameObject.prototype);

Bullet.prototype.fire = function() {
	window.requestAnimationFrame(()=>{
		this.move();
	});
}

Bullet.prototype.move = function() {
	GameObject.prototype.move.call(this);
	let collision = this.checkCollision();
	if(collision) {
		this.destroy();	
	} else {
		window.requestAnimationFrame(()=>{
			this.move();
		});
	}
	this.updateState();
	this.sendState();
}

module.exports = Bullet;