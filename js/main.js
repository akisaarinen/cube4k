function s() {
  /* Constant wrappers, will reduce minified size */
  var sin = Math.sin;
  var cos = Math.cos;
  var PI  = Math.PI;

  function getElementById(el) {
    return document.getElementById(el);
  }

    /* Initialize canvas */  
  var canvas = getElementById("c");
  var gl     = canvas.getContext("webgl");

  function loadShader(shaderType, id) {
    var src = getElementById(id).textContent;
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

  function createProgram(vertexId, fragmentId) {
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
  function gl_uniformLocation(variable) {
    return gl.getUniformLocation(program, variable);
  }
  function gl_bindBuffer(kind, buffer) {
    gl.bindBuffer(kind, buffer);
  }
  var gl_ELEMENT_ARRAY_BUFFER = gl.ELEMENT_ARRAY_BUFFER;
  var gl_ARRAY_BUFFER         = gl.ARRAY_BUFFER;

  function initShaders()
  {
    createProgram("v", "f");

    T = gl_uniformLocation("time");
    M = gl_uniformLocation("matColor");
    B = gl_uniformLocation("basePos");

    P = gl.getAttribLocation(program, "vPosition");
    N = gl.getAttribLocation(program, "vNormal");
  };

  function create(kind, verts) {
    var x = gl.createBuffer();
    gl_bindBuffer(kind, x);
    gl.bufferData(kind, verts, gl.STATIC_DRAW);
    gl_bindBuffer(kind, null);
    return x;
  }

  function bindBuffer(buffer, uniformLocation) {
    gl_bindBuffer(gl_ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(uniformLocation);
    gl.vertexAttribPointer(uniformLocation, 3, gl.FLOAT, false, 0, 0);
  }

  function draw()
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

    for (z = -n; z <= n; z+=1) {
      for (y = -n; y <= n; y+=1) {
        for (x = -n; x <= n; x+=1) {
          gl.uniform4f(M, 
            0.5 + 0.5*sin(PI * (x-n)/(2*n)), 
            0.2 + 0.5*cos(PI * (y-n)/(2*n)), 
            0.1 + 0.5*cos(PI * (z-n)/(2*n)), 
            1);
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

  /* Music */

  function dubstep(t) {
    return (t&t>>8)%256+(t>>4)+(t>>7);
  }
  function beat(t) {
    return t*(5186>>(t>>9&14)&15);
  }
  function dumdidum(t, shift) {
    return t*(5188>>(t>>9&14)&15)+(t>>shift)
  }
  function start(t) {
    return t*(((t>>12)|(t>>11)))
  }
  function silence(t) {
    return 0;
  }
  function toHex(value) {
    var hex = value.toString(16);
    if (value < 16) hex = "0" + hex;
    return "%" + hex;
  }
      
  function addSound(x, t0, len, f) {
    var freq = 11025;
    for (t = 0; t < freq*len; t++) {
      var value = (f(t+t0*freq,x) & 0xff) * 256;
      S += toHex(0xff & value);
      S += toHex((0xff00 & value)>>8);
    }
  };

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

  /* Create "music" :) */
  S = "data:audio/x-wav,%52%49%46%46%84%75%0d%00%57%41%56%45%66%6d%74%20%10%00%00%00%01%00%01%00%11%2b%00%00%22%56%00%00%02%00%10%00%64%61%74%61%f8%2f%14%00";

  addSound(0.0, 0.0, 1.6, start);
  addSound(0.0, 0.0, 4.0, beat);  
  addSound(1.0, 0.0, 2.6, dumdidum);  
  addSound(0.0, 0.0, 4.0, beat);  
  addSound(0.0, 2.5, 3.0, dubstep);
  addSound(0.0, 0.0, 2.0, silence);

  getElementById("a").src = S;

  /* Run graphics */
  var startTime = Date.now();
  draw();
}
s();