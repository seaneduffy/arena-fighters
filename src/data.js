module.exports = function(uri, callback) {
	let xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', uri, true);   
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(JSON.parse(xobj.responseText));
		}
	}
	xobj.send(null);
}