precision mediump float;
uniform vec4 M;

varying vec3 fragmentNormal;
varying vec3 lightVector;
varying vec3 cameraVector;

float MAX_DIST    = 20.0;
float MAX_DIST_SQ = MAX_DIST * MAX_DIST;
vec3 AMBIENT      = vec3(0.2);

void main(void){
  vec3 dfColor = vec3(1);
  vec3 sfColor = max(dfColor + 0.5, 1.0);

  vec3 C = normalize(cameraVector);
  vec3 N = normalize(fragmentNormal);
  vec3 L = normalize(lightVector);

  vec3 H = normalize(L + C);

  float distF = 1.0 - min(dot(lightVector, lightVector), MAX_DIST_SQ) / MAX_DIST_SQ;

  float df = max(0.0, dot(N, L));
  float sf = max(0.0, dot(N, H));
  
  vec3 diffuse  = dfColor*df*distF;
  vec3 specular = sfColor*pow(sf, 16.0)*distF;
  gl_FragColor = vec4(clamp(M.rgb * (diffuse + AMBIENT) + specular, 0.0, 1.0), M.a);
}