#target illustrator

var doc = app.activeDocument;

var positionLength = 8;

var filepath = Folder.selectDialog("Pick your destination");

var filenames = ["$left", "$right", "$upleft", "$upright", "$up", "$downleft", "$downright", "$down"];
	
var exportOptions = new ExportOptionsPNG24();
exportOptions.artBoardClipping = true;

for (var i=0; i<positionLength; i++) {
	doc.artboards.setActiveArtboardIndex(i);
	filename = filenames[i];
	doc.exportFile(File(filepath + "/" + filename), ExportType.PNG24, exportOptions);
}