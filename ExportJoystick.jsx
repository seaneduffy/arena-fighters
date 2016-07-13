#target illustrator

var doc = app.activeDocument;
var filepath = Folder.selectDialog("Pick your destination");
var filenames = ["upleft", "up", "upright", "left", "center", "right", "downleft", "down", "downright"];	
var exportOptions = new ExportOptionsPNG24();
exportOptions.artBoardClipping = true;
for(var i=0; i<filenames.length; i++) {
	doc.artboards.setActiveArtboardIndex(i);
	doc.exportFile (File(filepath + "/" + filenames[i]), ExportType.PNG24, exportOptions);
}