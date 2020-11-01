precision mediump float;
uniform vec4 u_keyboardList[40];
uniform float u_time;

vec3 hsv2rgb(vec3 c){
  vec4 K=vec4(1.,2./3.,1./3.,3.);
  vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);
  return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);
}

void main(void){

  vec4 overlappingColor[40];

  for(int i=40;i>=0;i--){
    if(u_keyboardList[i]==vec4(0.)){continue;}
    float time=u_keyboardList[i].w;
    float timeDiff=distance(u_time,time);
    float radius=distance(u_keyboardList[i].xy,gl_PointCoord.xy);
    if(
      radius<timeDiff
    ){
      float pitch=u_keyboardList[i].z;
      float wheeledPitch=mod(pitch*7.,1.);
      overlappingColor[i].x=wheeledPitch;
      overlappingColor[i].y=max(.7-timeDiff/4.,0.);
      overlappingColor[i].w=1.;
    }
  }

  vec3 sumHsv=vec3(0.);
  float lastHue=-1.;
  for(int i=10;i>=0;i--){
    if(overlappingColor[i].w!=1.){continue;}
    sumHsv.y+=distance(overlappingColor[i].x,lastHue);
    if(lastHue!=-1.){
      sumHsv.x=overlappingColor[i].x;
      sumHsv.z=
        distance(lastHue,overlappingColor[i].x);
    }
    else{
      sumHsv.x=overlappingColor[i].x;
    }
    lastHue=overlappingColor[i].x;
  }
  vec3 rgb=hsv2rgb(vec3(sumHsv.x,sumHsv.y/5.,1.));
  gl_FragColor=vec4(rgb.x,rgb.y,rgb.z,1.);
}
