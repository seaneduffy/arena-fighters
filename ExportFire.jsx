#target illustrator

var doc = app.activeDocument;
var filepath = Folder.selectDialog("Pick your destination");
var filenames = ["fire_up", "fire_down"];	
var exportOptions = new ExportOptionsPNG24();
exportOptions.artBoardClipping = true;
doc.artboards.setActiveArtboardIndex(0);
doc.exportFile (File(filepath + "/" + filenames[0]), ExportType.PNG24, exportOptions);
doc.artboards.setActiveArtboardIndex(1);
doc.exportFile (File(filepath + "/" + filenames[1]), ExportType.PNG24, exportOptions);