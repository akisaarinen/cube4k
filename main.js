function start() {
  var canvas = document.getElementById("glcanvas");
  gl = canvas.getContext("webgl");

  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  initShaders();
  myCube();
  drawPicture(gl);
}

var initShaders = function()
{
  var vShader, fShader;

  vShader = gpu.loadShader(gl.VERTEX_SHADER, "shade_vert");
  fShader = gpu.loadShader(gl.FRAGMENT_SHADER, "shade_frag");
  gpuShade = gpu.newProgram(vShader, fShader);

  hLightPos     = gl.getUniformLocation(gpuShade, "gLightPos");

  hRotate    = gl.getUniformLocation(gpuShade, "gRotate");
  hTranslate = gl.getUniformLocation(gpuShade, "gTranslate");
  hAngleX    = gl.getUniformLocation(gpuShade, "gAngleX");

  vaPosition = gl.getAttribLocation(gpuShade, "vPosition");
  vaNormal   = gl.getAttribLocation(gpuShade, "vNormal");
};

function drawPicture(gl)
{
  gl.viewport(0,0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  drawWorld();
  requestAnimationFrame(function() { drawPicture(gl); });
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
  gl.useProgram(gpuShade);

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

