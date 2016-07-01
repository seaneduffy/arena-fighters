function Ammunition() {
	Projectile.prototype.constructor.call(this);
}

Ammunition.prototype = Object.create(Projectile.prototype, {
	'damage': {
		set: function(damage) {
			this._damage = damage;
		},
		get: function() {
			return this._damage;
		}
	}
});

module.exports = Ammunition;