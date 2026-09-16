// Transparent heading bake: exact lights/framing from render-result-headings.mjs.
import * as THREE from 'three';
export function createStudio(canvas) {
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false,preserveDrawingBuffer:true});
  renderer.setPixelRatio(1);
  renderer.setClearColor(0,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.NoToneMapping;
  const scene=new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfff4d3,0x301528,2));
  const key=new THREE.DirectionalLight(0xffedc4,2.2);
  key.position.set(-3,5,8);scene.add(key);
  return {renderer,scene};
}
export function frameHeading(group,renderer,width=640) {
  group.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(group);
  const size=bounds.getSize(new THREE.Vector3());
  group.position.sub(bounds.getCenter(new THREE.Vector3()));
  const height=Math.ceil(width*(size.y+.24)/(size.x+.24));
  const halfWidth=(size.x+.24)/2,halfHeight=halfWidth*height/width;
  const camera=new THREE.OrthographicCamera(-halfWidth,halfWidth,halfHeight,-halfHeight,.1,20);
  camera.position.set(0,0,8);renderer.setSize(width,height);
  return camera;
}
