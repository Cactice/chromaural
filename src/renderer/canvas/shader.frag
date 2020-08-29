precision mediump float;
uniform vec3 u_keyboardList[40];
uniform float u_time;

void main(void){
  gl_FragColor=vec4(mod(u_time,1.),u_keyboardList[0]);
}