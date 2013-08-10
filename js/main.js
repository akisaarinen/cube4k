function start() {
  var canvas = document.getElementById("c");
  gl = canvas.getContext("webgl");

  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  initShaders();

  cubeVBuf = create(gl.ARRAY_BUFFER, cubeVerts);
  cubeNBuf = create(gl.ARRAY_BUFFER, cubeNorms);
  cubeIdxBuf = create(gl.ELEMENT_ARRAY_BUFFER, cubeIdx);

  Ts = Date.now();

  D();
}

var loadShader = function(shaderType, id) {
  var src = document.getElementById(id).textContent;
  var s = gl.createShader(shaderType);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("compile: '" + id + "': " + gl.getShaderInfoLog(s));
    throw "";
  }
  return s;
}

var createProgram = function(vertexId, fragmentId) {
  var v = loadShader(gl.VERTEX_SHADER, vertexId);
  var f = loadShader(gl.FRAGMENT_SHADER, fragmentId);

  P = gl.createProgram();
  gl.attachShader(P,v);
  gl.attachShader(P,f);
  gl.linkProgram(P);
  if (!gl.getProgramParameter(P, gl.LINK_STATUS)) {
    console.error("link: " + gl.getProgramInfoLog(P));
    throw "";
  }
  gl.validateProgram(P);
  if (!gl.getProgramParameter(P, gl.VALIDATE_STATUS)) {
    console.error("validate: " + gl.getProgramInfoLog(P));
    throw "";
  }
}

var initShaders = function()
{
  createProgram("shade_vert", "shade_frag");

  T  = gl.getUniformLocation(P, "time");
  R  = gl.getUniformLocation(P, "res");
  M  = gl.getUniformLocation(P, "matColor");
  B  = gl.getUniformLocation(P, "basePos");

  vP = gl.getAttribLocation(P, "vPosition");
  vN = gl.getAttribLocation(P, "vNormal");
};

function D()
{
  gl.viewport(0,0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var time = (Date.now() - Ts) / 1000.0;

  gl.useProgram(P);

  bind(cubeVBuf, vP);
  bind(cubeNBuf, vN);

  gl.uniform1f(T, time);
  
  for (var z = -5; z < 1; z++) {
    for (var y = -5; y < 5; y++) {
      for (var x = -5; x < 5; x++) {
        gl.uniform4f(M, 1, 0.5*Math.sin(x), 0.5*Math.sin(y), 1);  
        gl.uniform3f(B, x*2, y*2, z*2);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIdxBuf);
        gl.drawElements(gl.TRIANGLES, cubeIdx.length, gl.UNSIGNED_SHORT, 0);
      }
    }
  }

  requestAnimationFrame(function() { D(); });
}

function create(kind, verts) {
  var x = gl.createBuffer();
  gl.bindBuffer(kind, x);
  gl.bufferData(kind, verts, gl.STATIC_DRAW);
  gl.bindBuffer(kind, null);
  return x;
}

function bind(buffer, uniform) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(uniform);
  gl.vertexAttribPointer(uniform, 3, gl.FLOAT, false, 0, 0);
}


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

start();