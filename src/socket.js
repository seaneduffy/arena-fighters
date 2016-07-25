let socket = null;
	
module.exports = {
	emit: function(label, data) {
		if(!!socket)
			socket.emit(label, data);
	},
	on: function(label, callback) {
		if(!!socket)
			socket.on(label, (data)=>{
				callback(data);
			});
	},
	init: function() {
		socket = socket || !!io ? io() : false;
		return !!socket;
	}
}