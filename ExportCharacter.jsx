#target illustrator

var doc = app.activeDocument;

var positionLength = 8;
var frameLength = 9;

var filepath = Folder.selectDialog("Pick your destination");

var filenames = [
	["$down_standing", "$down_walking-1", "$down_walking-2", "$down_walking-3", "$down_walking-4", "$down_walking-5", "$down_walking-6", "$down_walking-7", "$down_walking-8"],
	["$downright_standing", "$downright_walking-1", "$downright_walking-2", "$downright_walking-3", "$downright_walking-4", "$downright_walking-5", "$downright_walking-6", "$downright_walking-7", "$downright_walking-8"],
	["$downleft_standing", "$downleft_walking-1", "$downleft_walking-2", "$downleft_walking-3", "$downleft_walking-4", "$downleft_walking-5", "$downleft_walking-6", "$downleft_walking-7", "$downleft_walking-8"],
	["$right_standing", "$right_walking-1", "$right_walking-2", "$right_walking-3", "$right_walking-4", "$right_walking-5", "$right_walking-6", "$right_walking-7", "$right_walking-8"],
	["$left_standing", "$left_walking-1", "$left_walking-2", "$left_walking-3", "$left_walking-4", "$left_walking-5", "$left_walking-6", "$left_walking-7", "$left_walking-8"],
	["$up_standing", "$up_walking-1", "$up_walking-2", "$up_walking-3", "$up_walking-4", "$up_walking-5", "$up_walking-6", "$up_walking-7", "$up_walking-8"],
	["$upright_standing", "$upright_walking-1", "$upright_walking-2", "$upright_walking-3", "$upright_walking-4", "$upright_walking-5", "$upright_walking-6", "$upright_walking-7", "$upright_walking-8"],
	["$upleft_standing", "$upleft_walking-1", "$upleft_walking-2", "$upleft_walking-3", "$upleft_walking-4", "$upleft_walking-5", "$upleft_walking-6", "$upleft_walking-7", "$upleft_walking-8"]
]
	
var exportOptions = new ExportOptionsPNG24();
exportOptions.artBoardClipping = true;

for (var i=0; i<positionLength; i++) {
	for(var j=0; j<frameLength; j++) {
		doc.artboards.setActiveArtboardIndex(i * frameLength + j);
		filename = filenames[i][j];
		doc.exportFile (File(filepath + "/" + filename), ExportType.PNG24, exportOptions);
	}
}