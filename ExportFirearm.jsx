#target illustrator

var doc = app.activeDocument;

var positionLength = 8;
var frameLength = 4;

var filepath = Folder.selectDialog("Pick your destination");

var filenames = [
	["$down_off", "$down_firing-1", "$down_firing-2", "$down_firing-3"], 
	["$downleft_off", "$downleft_firing-1", "$downleft_firing-2", "$downleft_firing-3"],
	["$downright_off", "$downright_firing-1", "$downright_firing-2", "$downright_firing-3"],
	["$left_off", "$left_firing-1", "$left_firing-2", "$left_firing-3"],
	["$right_off", "$right_firing-1", "$right_firing-2", "$right_firing-3"],
	["$up_off", "$up_firing-1", "$up_firing-2", "$up_firing-3"],
	["$upleft_off", "$upleft_firing-1", "$upleft_firing-2", "$upleft_firing-3"],
	["$upright_off", "$upright_firing-1", "$upright_firing-2", "$upright_firing-3"]
];
	
var exportOptions = new ExportOptionsPNG24();
exportOptions.artBoardClipping = true;

for (var i=0; i<positionLength; i++) {
	for(var j=0; j<frameLength; j++) {
		doc.artboards.setActiveArtboardIndex(i * frameLength + j);
		filename = filenames[i][j];
		doc.exportFile (File(filepath + "/" + filename), ExportType.PNG24, exportOptions);
	}
}