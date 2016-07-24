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
	
	"$downright_standing",
	"$downright_walking-1", 
	"$downright_walking-2", 
	"$downright_walking-3", 
	"$downright_walking-4", 
	"$downright_walking-5", 
	"$downright_walking-6",
	
	"$downleft_standing",
	"$downleft_walking-1", 
	"$downleft_walking-2", 
	"$downleft_walking-3", 
	"$downleft_walking-4", 
	"$downleft_walking-5", 
	"$downleft_walking-6",
	
	"$right_standing",
	"$right_walking-1", 
	"$right_walking-2", 
	"$right_walking-3", 
	"$right_walking-4", 
	"$right_walking-5", 
	"$right_walking-6",
	
	"$left_standing",
	"$left_walking-1", 
	"$left_walking-2", 
	"$left_walking-3", 
	"$left_walking-4", 
	"$left_walking-5", 
	"$left_walking-6",
	
	"$up_standing",
	"$up_walking-1", 
	"$up_walking-2", 
	"$up_walking-3", 
	"$up_walking-4", 
	"$up_walking-5", 
	"$up_walking-6",
	
	"$upright_standing",
	"$upright_walking-1", 
	"$upright_walking-2", 
	"$upright_walking-3", 
	"$upright_walking-4", 
	"$upright_walking-5", 
	"$upright_walking-6",
	
	"$upleft_standing",
	"$upleft_walking-1", 
	"$upleft_walking-2", 
	"$upleft_walking-3", 
	"$upleft_walking-4", 
	"$upleft_walking-5", 
	"$upleft_walking-6"
]
	
var exportOptions = new ExportOptionsPNG24();
exportOptions.artBoardClipping = true;

var exportPosition = function(i, j, k){
	doc.artboards.setActiveArtboardIndex(i * 5 + k);
	doc.exportFile (File(filepath + "/" + filenames[i * 7 + j]), ExportType.PNG24, exportOptions);
}

for(var i = 0; i<8; i++) {
	exportPosition(i, 0, 0);
	exportPosition(i, 1, 1);
	exportPosition(i, 2, 2);
	exportPosition(i, 3, 1);
	exportPosition(i, 4, 3);
	exportPosition(i, 5, 4);
	exportPosition(i, 6, 3);
}


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