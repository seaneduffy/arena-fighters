let socket = io();

module.exports = {
	emit: function(label, data) {
		socket.emit(label, data);
	},
	on: function(label, callback) {
		socket.on(label, (data)=>{
			callback(data);
		});
	}
}