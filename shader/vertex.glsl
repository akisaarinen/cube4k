uniform float T;
uniform vec3  B;

attribute vec3 P;
attribute vec3 N;

varying vec3 lightVector;
varying vec3 cameraVector;
varying vec3 fragmentNormal;

mat4 projection = mat4(1.3,0,0,0,0,1.73,0,0,0,0,-1,-1,0,0,-.2,0);

mat4 translate(vec3 pos) {
  mat4 m = mat4(1.0);
  m[3][0] = pos[0];
  m[3][1] = pos[1];
  m[3][2] = pos[2];
  return m;
}

mat3 rx(float t) {
  return mat3(
  1,      0,       0,
  0, cos(t), -sin(t),
  0, sin(t),  cos(t)
  );
}

mat3 ry(float t) {
  return mat3(
  cos(t), 0, sin(t),
  0, 1, 0,
  -sin(t), 0, cos(t)
  );
}

mat4 view(mat3 R, vec3 P) {
  mat4 result = mat4(mat3(R));
  result[3] = vec4(P, 1);
  return result;
}

mat4 transpose(mat4 m) {
  return mat4(
    m[0][0], m[1][0], m[2][0], m[3][0],
    m[0][1], m[1][1], m[2][1], m[3][1],
    m[0][2], m[1][2], m[2][2], m[3][2],
    m[0][3], m[1][3], m[2][3], m[3][3]
  );
}

mat4 viewInv(mat3 R, vec3 P) {
  mat3 Rt;
  Rt = mat3(
    R[0][0], R[1][0], R[2][0],
    R[0][1], R[1][1], R[2][1],
    R[0][2], R[1][2], R[2][2]
  );
  mat4 result = mat4(Rt);
  result[3] = vec4(-Rt * P, 1);
  return transpose(result);
}

void main() {
  float t = T * 5.;
  float d = 3.0;

  vec3 lightPosition = vec3(0, 0.0, -15.0);

  vec3 objT = B;
  mat3 objR = rx(sin(t*0.1)*6.0) * ry(sin(t*0.1)*3.7);

  vec3 worldT = vec3(0,0,-12.0);
  mat3 worldR = ry(3.0*sin(t/6.0)) * rx(3.0*sin(t/5.0));

  vec4 oVertex = view   (objR, objT) * vec4(P, 1);
  vec4 oNormal = viewInv(objR, objT) * vec4(N,  1);

  vec4 wVertex = view   (worldR, worldT) * oVertex;
  vec4 wNormal = viewInv(worldR, worldT) * oNormal;

  gl_Position    = (projection * wVertex);
  fragmentNormal = (projection * wNormal).xyz;

  lightVector  = lightPosition - oVertex.xyz;
  cameraVector = worldT        - oVertex.xyz;
}