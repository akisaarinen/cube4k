#!/usr/bin/env node
var sys  = require('sys');
var jade = require('jade');
var fs   = require('fs');
var exec = require('child_process').exec;

// Configuration

var inputVertexShader 	= "shader/vertex.glsl";
var inputFragmentShader = "shader/fragment.glsl";

var inputMinifiedVertex   = "build/vertex.min.glsl";
var inputMinifiedFragment = "build/fragment.min.glsl";
var inputJavaScript 	  = "build/cube4k.min.js";

var output = "cube4k.min.html";

// First, concatenate both of the shader files (they need to be minified together), 
// and add preprocessing directives to the GLSL compiler.

var concateShaderFiles = function() {
	var vertexShader   = fs.readFileSync(inputVertexShader, "utf-8");
	var fragmentShader = fs.readFileSync(inputFragmentShader, "utf-8");

	var bothShaders = 
		"//! VERTEX\n" + 
		vertexShader + "\n" + 
		"//! FRAGMENT\n" + 
		fragmentShader + "\n";

	fs.writeFileSync("build/shaders.glsl", bothShaders, "utf-8");
};

// Run the GLSL compiler -- couldn't find an easy way of invoking it directly from
// Node and hasn't been modified for a while, so this has to do. This is
// likely to break with some setups, only tested in my OSX.

var runGLSLCompiler = function(onReady) {
	var glslCmd = "node node_modules/glsl-unit/bin/basic_glsl_compiler.js --input build/shaders.glsl --variable_renaming INTERNAL";
	var child = exec(glslCmd, function(error, stdout, stderr) {
		if (error != null) {
			sys.print("Error executing glsl-compiler:\n");
			sys.print(error+"\n");
		} else {
			var lines = stdout.split("\n");
			var vertex = [], fragment = []; 
			var mode = 0;
			for (var i = 0; i < lines.length; i++) {
				if (lines[i] === "//! VERTEX") {
					mode++;
				} else if (lines[i] === "//! FRAGMENT") {
					mode++;
				} else {
					switch(mode) {
						case 0: break;
						case 1: vertex.push(lines[i]); break;
						case 2: fragment.push(lines[i]); break;
					}
				}
			}
			onReady(vertex.join("\n"), fragment.join("\n"));
		}
	});
};

// Combine everything which has been minified into one single file with
// a jade template.

var combineMinifiedSources = function(vertexShaderMinified, fragmentShaderMinified) {
	var html = jade.renderFile(
		"template.jade",
		{ 
			javaScript:     fs.readFileSync(inputJavaScript, "utf-8"),
			vertexShader:   vertexShaderMinified,
			fragmentShader: fragmentShaderMinified
		}
	);

	fs.writeFileSync(output, html, "utf-8");
}

concateShaderFiles();
runGLSLCompiler(combineMinifiedSources);
