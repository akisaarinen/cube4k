
/* Inverting matrix (for normal transformation):

-      M = {
-        {R11, R12, R13, 0},
-        {R21, R22, R23, 0},
-        {R31, R32, R33, 0},
-        {tx, ty, tz, 1},
-      };
-
-      Rt = {
-        {R11, R21, R31},
-        {R12, R22, R32},
-        {R13, R23, R33}
-      }
-
-      Rt*t = t'
-
-      M-1 = {
-        {R11, R21, R31, 0},
-        {R12, R22, R32, 0},
-        {R13, R23, R33, 0},
-        {-t'x, -t'y, -t'z, 1},
-      };
*/


function start() {
  var canvas = document.getElementById("c");
  gl = canvas.getContext("webgl");

  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  //gl.depthFunc(gl.LEQUAL);
  //gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

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
  X  = gl.getUniformLocation(P, "X");
  vP = gl.getAttribLocation(P, "vPosition");
  vN = gl.getAttribLocation(P, "vNormal");
};

function D()
{
  gl.viewport(0,0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(P);

  var time = (Date.now() - Ts) / 100.0;

  gl.uniform1f(X, A / 2.0 / Math.PI);
  gl.uniform1f(T, (Date.now() - Ts) / 1000.0);
  gl.uniform2f(R, gl.viewportWidth, gl.viewportHeight);

  bind(cubeVBuf, vP);
  bind(cubeNBuf, vN);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIdxBuf);
  gl.drawElements(gl.TRIANGLES, cubeIdx.length, gl.UNSIGNED_SHORT, 0);

  A += 0.45;
  if (A > 360) {
    A -= 360;
  }

  requestAnimationFrame(function() { D(); });
}

/*
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

var gen = function(x,y,l) {
  var result = [];
  for (var i=1; i <= l; i++) {
    result.push((Math.sin(x*i) * Math.cos(y*i + 2*i)) > 0 ? -0.5 : 0.5);
  }
  return result;
}

function deq(a,b) {
  for(var i=0; i < a.length; i++) {
    if (a[i] != b[i]) {
      return false;
    }
  }
  return true;
}


var seed = 0.32;
var incr = 2.23;
for (var i = 0; i < 1000000; i++) {
  var generated = gen(seed, seed, 72);
  seed += incr;
  if (deq(cubeVerts, generated)) {
    console.log("found! seed: " + seed);
    alert("found! seed: " + seed);
    break;
  }
  console.log(generated.length);
  console.log(generated);
  break;
}
console.log("nope..");
*/

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

A = 0.0;
Ai = 0.1;

