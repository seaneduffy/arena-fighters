#target illustrator

var doc = app.activeDocument;

var filepath = Folder.selectDialog("Pick your destination");

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
	"$down_attacking-1",
	"$down_attacking-2"
]
	
var exportOptions = new ExportOptionsPNG24();
exportOptions.artBoardClipping = true;

doc.artboards.setActiveArtboardIndex(0);
doc.exportFile (File(filepath + "/" + filenames[0]), ExportType.PNG24, exportOptions);
doc.artboards.setActiveArtboardIndex(1);
doc.exportFile (File(filepath + "/" + filenames[1]), ExportType.PNG24, exportOptions);
doc.artboards.setActiveArtboardIndex(2);
doc.exportFile (File(filepath + "/" + filenames[2]), ExportType.PNG24, exportOptions);
doc.artboards.setActiveArtboardIndex(1);
doc.exportFile (File(filepath + "/" + filenames[3]), ExportType.PNG24, exportOptions);
doc.artboards.setActiveArtboardIndex(0);
doc.exportFile (File(filepath + "/" + filenames[4]), ExportType.PNG24, exportOptions);
doc.artboards.setActiveArtboardIndex(3);
doc.exportFile (File(filepath + "/" + filenames[5]), ExportType.PNG24, exportOptions);
doc.artboards.setActiveArtboardIndex(4);
doc.exportFile (File(filepath + "/" + filenames[6]), ExportType.PNG24, exportOptions);
doc.artboards.setActiveArtboardIndex(3);
doc.exportFile (File(filepath + "/" + filenames[7]), ExportType.PNG24, exportOptions);
doc.artboards.setActiveArtboardIndex(0);
doc.exportFile (File(filepath + "/" + filenames[8]), ExportType.PNG24, exportOptions);
doc.artboards.setActiveArtboardIndex(5);
doc.exportFile (File(filepath + "/" + filenames[9]), ExportType.PNG24, exportOptions);
doc.artboards.setActiveArtboardIndex(6);
doc.exportFile (File(filepath + "/" + filenames[10]), ExportType.PNG24, exportOptions);