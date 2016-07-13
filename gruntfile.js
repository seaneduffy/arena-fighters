'use strict';

module.exports = function(grunt) {
	
	grunt.registerTask('process-sprite-data', 'process sprite data', function() {
		let paths = grunt.file.expand("src/data/**/*.json");
		paths.forEach(path=>{
			console.log(path);
			let content = grunt.file.read(path),
				suffix = path.match(/[h|m|s]d/);
			if(!!suffix) suffix = suffix[0];
			content = content.replace(/frames/, 
				path.match(/[a-z|A-Z|0-9]+\.json/)[0].replace('.json','') + 
				'-' + suffix || '');
			grunt.file.write(path.replace(/src\/data/, 'src/processed_data'), content);
		});
	});

	grunt.initConfig({
		browserify: {
			dist: {
				options: {
					transform: [["babelify", { presets: ["react", "es2015"] }]]
				},
				files: {
					"public/js/game.js": "src/index.js"
				}
			}
		},
		"merge-json": {
			"all": {
				src: [ "src/processed_data/**/*.json" ],
				dest: "public/data.json"
			}
		}
	});

	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks('grunt-merge-json');
	
	grunt.registerTask("default",["browserify", "process-sprite-data", "merge-json"]);
	grunt.registerTask("build",["browserify"]);
	grunt.registerTask("data", ["process-sprite-data", "merge-json"]);

};