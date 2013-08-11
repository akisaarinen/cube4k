function s() {
  /* Constant wrappers, will reduce minified size */
  var sin = Math.sin;
  var cos = Math.cos;
  var PI  = Math.PI;

  /* Initialize canvas */  
  var canvas = document.getElementById("c");
  var gl     = canvas.getContext("webgl");

  var loadShader = function(shaderType, id) {
    var src = document.getElementById(id).textContent;
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (DEBUG) {
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("compile: '" + id + "': " + gl.getShaderInfoLog(shader));
        throw "";
      }
    }
    return shader;
  }

  var createProgram = function(vertexId, fragmentId) {
    var vertex   = loadShader(gl.VERTEX_SHADER,   vertexId);
    var fragment = loadShader(gl.FRAGMENT_SHADER, fragmentId);

    program = gl.createProgram();
    gl.attachShader(program,vertex);
    gl.attachShader(program,fragment);
    gl.linkProgram(program);

    if (DEBUG) {
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var error = "link: " + gl.getProgramInfoLog(program);
        console.error(error);
        throw error;
      }
      gl.validateProgram(program);
      if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        var error = "validate: " + gl.getProgramInfoLog(program);
        console.error(error);
        throw error;
      }
    }
  }

  /* OpenGL wrappers to enable better minified compression.
     This way these can be renamed to one or two letter functions,
     unlike gl.* because they can not be renamed. Usually worth it if
     there are over 2 invocations. */
  var gl_uniformLocation = function(variable) {
    return gl.getUniformLocation(program, variable);
  }
  var gl_bindBuffer = function(kind, buffer) {
    gl.bindBuffer(kind, buffer);
  }
  var gl_ELEMENT_ARRAY_BUFFER = gl.ELEMENT_ARRAY_BUFFER;
  var gl_ARRAY_BUFFER         = gl.ARRAY_BUFFER;

  var initShaders = function()
  {
    createProgram("v", "f");

    T = gl_uniformLocation("time");
    M = gl_uniformLocation("matColor");
    B = gl_uniformLocation("basePos");

    P = gl.getAttribLocation(program, "vPosition");
    N = gl.getAttribLocation(program, "vNormal");
  };

  var create = function(kind, verts) {
    var x = gl.createBuffer();
    gl_bindBuffer(kind, x);
    gl.bufferData(kind, verts, gl.STATIC_DRAW);
    gl_bindBuffer(kind, null);
    return x;
  }

  var bindBuffer = function(buffer, uniformLocation) {
    gl_bindBuffer(gl_ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(uniformLocation);
    gl.vertexAttribPointer(uniformLocation, 3, gl.FLOAT, false, 0, 0);
  }

  var draw = function()
  {
    var time = (Date.now() - startTime) / 1000.0;

    gl.viewport(0,0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniform1f(T, time);
    bindBuffer(cubeVBuf, P);
    bindBuffer(cubeNBuf, N);

    var n     = 4;
    var scale = 0.95 + 0.20*sin(time);

    for (var z = -n; z <= n; z+=1) {
      for (var y = -n; y <= n; y+=1) {
        for (var x = -n; x <= n; x+=1) {
          var xc = 0.5 + 0.5*sin(PI * (x-n)/(2*n));
          var yc = 0.2 + 0.5*cos(PI * (y-n)/(2*n));
          var zc = 0.1 + 0.5*cos(PI * (z-n)/(2*n));

          gl.uniform4f(M, xc, yc, zc, 1);
          gl.uniform3f(B, x*scale, y*scale, z*scale);
          gl_bindBuffer(gl_ELEMENT_ARRAY_BUFFER, cubeIdxBuf);
          gl.drawElements(gl.TRIANGLES, cubeIdx.length, gl.UNSIGNED_SHORT, 0);
        }
      }
    }

    requestAnimationFrame(draw);
  }
  /* Vertex data. Not optimized *AT ALL* for now. The cube now takes
     about 500 bytes... */
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
  // Scale down
  for(var i = 0; i < cubeVerts.length; i++) {
    cubeVerts[i] = 0.5*cubeVerts[i];
  }
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

  /* Initialize buffers */
  var program;
  var cubeVBuf   = create(gl_ARRAY_BUFFER, cubeVerts);
  var cubeNBuf   = create(gl_ARRAY_BUFFER, cubeNorms);
  var cubeIdxBuf = create(gl_ELEMENT_ARRAY_BUFFER, cubeIdx);  

  /* Initialize shaders */
  initShaders();

  /* Setup WebGL */
  gl.viewportWidth  = canvas.width;
  gl.viewportHeight = canvas.height;
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  /* Run */
  var startTime = Date.now(); 
  draw();
}
s();