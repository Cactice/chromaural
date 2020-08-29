uniform mediump vec3 u_keyboardList;

void main(void){
  gl_FragColor=vec4(u_keyboardList,1);
}