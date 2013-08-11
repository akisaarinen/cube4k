#!/usr/bin/env node
var jade = require('jade');
var fs   = require('fs');

var html = jade.renderFile(
	"template.jade",
	{ 
		vertexShader: 	fs.readFileSync("shader/vertex.glsl", "utf-8"),
		fragmentShader: fs.readFileSync("shader/fragment.glsl", "utf-8"),
		javaScript:     fs.readFileSync("build/Cube.min.js", "utf-8")
	}
);

fs.writeFileSync("cube.min.html", html);