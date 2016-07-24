#target illustrator

var doc = app.activeDocument;

var filenames = [
	"$down_standing",
	"$down_walking-1", 
	"$down_walking-2", 
	"$down_walking-3", 
	"$down_walking-4", 
	"$down_walking-5", 
	"$down_walking-6",
	"$down_walking-7",
	"$down_walking-8",
	"$down_walking-9",
	"$down_attacking-1",
	"$down_attacking-2"
]

var newRect = function(x, y, width, height) {
    var l = 0;
    var t = 1;
    var r = 2;
    var b = 3;

    var rect = [];

    rect[l] = x;
    rect[t] = -y;
    rect[r] = width + x;
    rect[b] = -(height - rect[t]);

    return rect;
};
	
var exportOptions = new ExportOptionsPNG24();
exportOptions.artBoardClipping = true;

var length = doc.artboards.length;

for(var i=0; i<length; i++) {
	doc.artboards[i].artboardRect = newRect(i % 5 * 112, Math.floor(i / 5) * 206, 112, 206);	
}