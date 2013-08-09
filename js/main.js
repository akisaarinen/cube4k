function start() {
  var canvas = document.getElementById("glcanvas");
  gl = canvas.getContext("webgl");

  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  prog = initShaders();
  myCube();
  drawPicture(gl);
}

var loadShader = function(shaderType, id) {
  var src = document.getElementById(id).textContent;
  var s = gl.createShader(shaderType);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("compile: '" + id + "': " + gl.getShaderInfoLog(s));
  }
  return s;
}

var createProgram = function(vertexId, fragmentId) {
  var v = loadShader(gl.VERTEX_SHADER, vertexId);
  var f = loadShader(gl.FRAGMENT_SHADER, fragmentId);
  var p = gl.createProgram();
  gl.attachShader(p,v);
  gl.attachShader(p,f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error("link: " + gl.getProgramInfoLog(p));
  }
  gl.validateProgram(p);
  if (!gl.getProgramParameter(p, gl.VALIDATE_STATUS)) {
    console.error("validate: " + gl.getProgramInfoLog(p));
  }
  return p;
}

var initShaders = function()
{
  var p = createProgram("shade_vert", "shade_frag");

  hLightPos  = gl.getUniformLocation(p, "gLightPos");
  hRotate    = gl.getUniformLocation(p, "gRotate");
  hTranslate = gl.getUniformLocation(p, "gTranslate");
  hAngleX    = gl.getUniformLocation(p, "gAngleX");

  vaPosition = gl.getAttribLocation(p, "vPosition");
  vaNormal   = gl.getAttribLocation(p, "vNormal");

  return p;
};

function drawPicture(gl)
{
  gl.viewport(0,0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  drawWorld();
  requestAnimationFrame(function() { drawPicture(gl); });
}

var ur = function(v,d) {
  var result = [];
  var i = -1;
  while(++i<d.length) {
    for(var j=0;j<d[i];j++) {
      result.push(v);
    }
    v=-v;
  }
  return result;
}

var zip3 = function(a,b,c) {
  var x = [];
  for (var i=0;i<a.length; i++) {
    x.push(a[i], b[i], c[i]);
  }
  return x;
}

// 3173 bytes @start
var a = ur(-.5, [2,2,4,1,1,1,1,5,1,1,1,2,2]);
var b = ur( .5, [1,1,1,1,1,1,1,1,5,1,1,5,1,1,1,1]);
var c = ur( .5, [4,2,2,2,4,2,2,6]);
var cubeVerts = new Float32Array(zip3(a,b,c));

/*
var cubeVerts = new Float32Array([
    -0.5,  0.5,  0.5,   // 0
    -0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
     0.5, -0.5,  0.5,
    -0.5,  0.5, -0.5,   // 4
    -0.5, -0.5, -0.5,
    -0.5,  0.5,  0.5,
    -0.5, -0.5,  0.5,
     0.5,  0.5, -0.5,   // 8
    -0.5,  0.5, -0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
     0.5,  0.5,  0.5,   // 12
     0.5, -0.5,  0.5,
     0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5, -0.5,  0.5,   // 16
    -0.5, -0.5,  0.5,
     0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,   // 20
     0.5, -0.5, -0.5,
    -0.5,  0.5, -0.5,
    -0.5, -0.5, -0.5,
]);
*/

var cubeNorms = new Float32Array([
     0,  0,  1,
     0,  0,  1,
     0,  0,  1,
     0,  0,  1,
    -1,  0,  0,
    -1,  0,  0,
    -1,  0,  0,
    -1,  0,  0,
     0,  1,  0,
     0,  1,  0,
     0,  1,  0,
     0,  1,  0,
     1,  0,  0,
     1,  0,  0,
     1,  0,  0,
     1,  0,  0,
     0, -1,  0,
     0, -1,  0,
     0, -1,  0,
     0, -1,  0,
     0,  0, -1,
     0,  0, -1,
     0,  0, -1,
     0,  0, -1,
]);

var cubeIdx = new Uint16Array([
     0,  1,  2,  1,  3,  2,
     4,  5,  6,  5,  7,  6,
     8,  9, 10,  9, 11, 10,
    12, 13, 14, 13, 15, 14,
    16, 17, 18, 17, 19, 18,
    20, 21, 22, 21, 23, 22,
]);

var myCube = function()
{
        cubeVBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBuf);
        gl.bufferData(gl.ARRAY_BUFFER, cubeVerts, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
        cubeNBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeNBuf);
        gl.bufferData(gl.ARRAY_BUFFER, cubeNorms, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
        cubeIdxBuf = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIdxBuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeIdx, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};


function drawWorld() {
  gl.useProgram(prog);

  gl.uniform1f(hAngleX, currentAngle / 2.0 / Math.PI);
  gl.uniform4f(hLightPos, 0.5, 1.0, 1.0, 0.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBuf);
        gl.enableVertexAttribArray(vaPosition);
        gl.vertexAttribPointer(vaPosition, 3, gl.FLOAT, false, 0, 0);
        
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeNBuf);
        gl.enableVertexAttribArray(vaNormal);
        gl.vertexAttribPointer(vaNormal, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIdxBuf);
    gl.drawElements(gl.TRIANGLES, cubeIdx.length, gl.UNSIGNED_SHORT, 0);
 
    currentAngle += 0.45;
    if (currentAngle > 360) {
        currentAngle -= 360;
    }
}

currentAngle = 0.0;
incAngle = 0.1;

