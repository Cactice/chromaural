precision mediump float;
uniform vec4 u_keyboardList[40];
uniform float u_time;

vec3 hsv2rgb(vec3 c){
  vec4 K=vec4(1.,2./3.,1./3.,3.);
  vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);
  return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);
}

void main(void){

  gl_FragColor=vec4(1.);
  float lastPitch=0.;
  for(int i=0;i<40;i++){
    float time=u_keyboardList[i].w;
    float xDiff=distance(gl_FragCoord.x/640.,u_keyboardList[i].x);
    float yDiff=distance(gl_FragCoord.y/480.,u_keyboardList[i].y);
    float circle=cos(xDiff*3.1)*sin(yDiff*3.1);
    if(
      circle<-(u_time-time)+.1
    ){
      float pitch=u_keyboardList[i].z;
      lastPitch=pitch;
      vec3 rgb=hsv2rgb(vec3(mod(pitch,1.),u_time-time,0.8));
      gl_FragColor=vec4(rgb,1.);
    }
  }
}