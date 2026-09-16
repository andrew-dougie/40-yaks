// Rendering recipe adapted from Lil Miner’s Ruin afcc459. See SOURCE.md.
// Copyright 2026 Andrew White. Distributed under the repository OFL.txt.
import * as THREE from 'three';
import glyphs from '../../sources/game-glyphs.json' with { type: 'json' };
import { FloatingSceneTitle } from './floating-scene-title.js';

export const facePalettes = Object.freeze({
  heading: [0x891d19,0xff7653], title: [0xa51d13,0xff5d3d],
  positive: [0x176b3d,0x91ef72], negative: [0x183b97,0x70bfff]
});

function outline(points) {
  const shape = new THREE.Shape();
  points.forEach(([x,y], i) => i ? shape.lineTo(x,y) : shape.moveTo(x,y));
  shape.closePath(); return shape;
}
function shapeFor(letter) {
  const glyph = glyphs[letter], shape = outline(glyph.p);
  for (const points of glyph.holes ?? []) shape.holes.push(outline(points));
  return shape;
}
function extrude(shape, depth, bevelSize, bevelThickness) {
  return new THREE.ExtrudeGeometry(shape, { depth, curveSegments: 1, steps: 1,
    bevelEnabled: true, bevelSegments: 1, bevelSize, bevelThickness });
}
function solid(parent, geometry, material, position = [0,0,0]) {
  const mesh = new THREE.Mesh(geometry, material); mesh.position.set(...position);
  mesh.castShadow = true; parent.add(mesh); return mesh;
}
function paintFace(geometry, index, brightness = 1, range = [0,1], palette = [0x891d19,0xff7653]) {
  const positions = geometry.getAttribute('position'), colors = [];
  const bottom = new THREE.Color(palette[0]), top = new THREE.Color(palette[1]);
  // The selected coral/gold palette uses one consistent vertical enamel gradient.
  for (let i = 0; i < positions.count; i++) {
    const y = THREE.MathUtils.clamp((positions.getY(i)-range[0])/(range[1]-range[0]), 0, 1);
    const c = bottom.clone().lerp(top, Math.pow(y, .65)).multiplyScalar(brightness); colors.push(c.r,c.g,c.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
}
export class TitleLogo {
  constructor(scene) {
    this.root = new THREE.Group(); this.root.name = "LIL MINER'S RUIN — sculpted storybook title"; scene.add(this.root);
    this.letters = []; this.words = [];
    this.edge = new THREE.MeshPhongMaterial({ color: 0x71401b, emissive: 0x301505, emissiveIntensity: .35, shininess: 20, flatShading: true });
    this.gold = new THREE.MeshPhongMaterial({ color: 0xffd51a, emissive: 0xffb900, emissiveIntensity: .85, specular: 0xfffac2, shininess: 65, flatShading: true, fog: false });
    // The README title uses bright vermilion enamel. Cave fog must not wash
    // this foreground lettering purple as its camera placement changes.
    this.enamelPalette = [0xa51d13,0xff5d3d];
    this.enamel = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true, fog: false });
    this.glint = new THREE.MeshBasicMaterial({ color: 0xfff4c2, fog: false });
    this.brass = new THREE.MeshPhongMaterial({ color: 0xffdf83, emissive: 0x956015, emissiveIntensity: .45, specular: 0xfff4c2, shininess: 45, flatShading: true, fog: false });
    this.iron = new THREE.MeshPhongMaterial({ color: 0x403a30, flatShading: true, fog: false });
    this.flame = new THREE.MeshBasicMaterial({ color: 0xffc332, fog: false });
    this.addWord('LIL', 1.08, 1.16, [-.19,.03,.14], [0,.06,-.02], -.69);
    this.addWord("MINER'S", 3.20, .47, [-.13,.06,-.06,.06,-.09,-.13,.12], [.0,.03,.04,.01,.03,.26,.02]);
    this.addWord('RUIN', 3.02, -.55, [-.17,-.04,.03,.13], [.03,-.035,.01,.06], .04, true);
    this.motion = new FloatingSceneTitle(this.root, { position: [.22,4.61,1.08], rotation: [-.02,.23,-.055], scale: .88 });
    this.update(0,true,true);
  }
  addCandle(pivot) {
    const candle=new THREE.Group(); candle.name="Sculpted candle I";
    pivot.add(candle); candle.scale.setScalar(1.12); pivot=candle;
    // Preserve the authored candle geometry; the README gives its wax a softer
    // rust red than the lettering, with a bright brass cup and dark mounting stem.
    const waxPalette=[0x8e291d,0xe96b4c];
    const wax=(geometry,position,brightness=1)=>{geometry.translate(...position);paintFace(geometry,12,brightness,[0,1],waxPalette);return solid(pivot,geometry,this.enamel);};
    wax(new THREE.CylinderGeometry(.20,.22,.81,9),[0,.675,.08]);
    solid(pivot,new THREE.CylinderGeometry(.24,.28,.08,8),this.brass,[0,.04,.08]);
    solid(pivot,new THREE.CylinderGeometry(.10,.10,.16,8),this.iron,[0,.14,.08]);
    solid(pivot,new THREE.CylinderGeometry(.29,.23,.07,10),this.brass,[0,.235,.08]);
    wax(new THREE.CylinderGeometry(.195,.20,.025,9),[0,1.08,.08],.35);
    for(let i=0;i<6;i++) {
      const angle=i/6*Math.PI*2,length=.14+(i%3)*.075;
      const drip=new THREE.SphereGeometry(1,7,5);drip.scale(.042,length/2,.035);
      wax(drip,[Math.sin(angle)*.19,1.065-length/2,.08+Math.cos(angle)*.19],.35);
    }
    const wick=solid(pivot,new THREE.CylinderGeometry(.018,.018,.13,5),this.edge,[.01,1.13,.08]);
    wick.rotation.z=-.18;
    const fire=new THREE.Group();fire.position.set(.02,1.18,.08);pivot.add(fire);
    const flameProfile=[[0,0],[.085,.05],[.088,.18],[.035,.34],[0,.44]].map(([r,y])=>new THREE.Vector2(r,y));
    const shell=solid(fire,new THREE.LatheGeometry(flameProfile,7),this.flame);shell.scale.z=.78;
    const core=solid(fire,new THREE.SphereGeometry(1,7,5),this.glint,[0,.12,.055]);core.scale.set(.042,.12,.025);
    this.candleFlame=fire;
  }
  addWord(text,width,baseline,angles,bounces,offset=0,candle=false) {
    const line=new THREE.Group(); line.name=`Title word ${text}`; this.root.add(line); let cursor=0;
    for(let i=0;i<text.length;i++) {
      const letter=text[i],glyph=glyphs[letter],pivot=new THREE.Group();
      const hostGeometry = null; // Use the authored contours, never a host font substitute.
      const advance=hostGeometry ? hostGeometry.boundingBox.getSize(new THREE.Vector3()).x : candle && letter==='I' ? .80 : glyph.w;
      pivot.name=`Sculpted title letter ${letter}`;
      pivot.position.set(cursor+advance/2,bounces[i],Math.sin(i*2)*.016); pivot.rotation.z=angles[i]; line.add(pivot);
      if(hostGeometry) {
        solid(pivot,hostGeometry,this.enamel);
      } else if(candle && letter==='I') this.addCandle(pivot);
      else {
        const shape=shapeFor(letter),punctuation=letter==="'";
        const back=extrude(shape,.25,punctuation ? .045 : .11,.045); back.translate(-glyph.w/2,0,-.25);
        const rim=extrude(shape,.028,punctuation ? .027 : .09,.036); rim.translate(-glyph.w/2,0,.012);
        const face=extrude(shape,.01,.003,.005); face.translate(-glyph.w/2,0,.083); paintFace(face,this.letters.length,1,[0,1],this.enamelPalette);
        solid(pivot,back,this.edge); solid(pivot,rim,this.gold); solid(pivot,face,this.enamel);
        // Gold-lined counters need an explicit front lip and deep inner wall: the
        // outer bevel alone disappears behind the enamel face in the game camera.
        for(const points of glyph.holes ?? []) {
          const center=points.reduce((c,p)=>[c[0]+p[0]/points.length,c[1]+p[1]/points.length],[0,0]);
          const scaled=factor=>points.map(p=>[center[0]+(p[0]-center[0])*factor,center[1]+(p[1]-center[1])*factor]);
          const collar=outline(scaled(1.09)); collar.holes.push(outline(scaled(.65)));
          const lining=extrude(collar,.25,.003,.003); lining.translate(-glyph.w/2,0,-.15);
          solid(pivot,lining,this.gold);
        }
      }
      this.letters.push({pivot,angle:angles[i],index:this.letters.length}); cursor+=advance+.075;
    }
    line.updateMatrixWorld(true);
    const bounds=new THREE.Box3().setFromObject(line),center=bounds.getCenter(new THREE.Vector3());
    const scale=width/(bounds.max.x-bounds.min.x); line.scale.setScalar(scale); line.position.set(-center.x*scale+offset,baseline,0); this.words.push({line,baseline});
  }
  opening(pose) {
    if(pose.settled)return; // Match the ordinary menu exactly after the authored arrival.
    this.root.rotation.x += (1-pose.arrival)*.32;
    this.root.rotation.y += pose.turn;
    this.root.rotation.z += Math.sin(pose.arrival*Math.PI*2)*(1-pose.arrival)*.14;
    this.root.scale.multiplyScalar(pose.scale);
    for(let i=0;i<this.words.length;i++)this.words[i].line.position.y+=pose.wordOffsets[i];
    this.candleFlame?.scale.multiplyScalar(1+pose.flare*.65);
    this.gold.emissiveIntensity=.85+pose.flare*.65;
  }
  update(dt,visible,reducedMotion=false,camera=null,region=null,idleAmount=1) {
    this.motion.update(dt,visible,reducedMotion,camera,region,idleAmount);
    if(!this.root.visible)return;
    const t=reducedMotion?0:this.motion.age;
    for(const {pivot,angle,index} of this.letters){pivot.rotation.x=0;pivot.rotation.z=angle+Math.sin(t*1.1+index*.7)*.007;pivot.rotation.y=Math.sin(t*.8+index*.6)*.012;}
    this.gold.emissiveIntensity=.85;
    for(const {line,baseline} of this.words)line.position.y=baseline;
    this.candleFlame?.scale.set(1+Math.sin(t*6)*.035,1+Math.sin(t*4.3)*.055,1);
  }
}

// Shared headline authoring: genuine beveled meshes, using the logo's palette,
// counters and enamel gradient. Whitespace gets real tracking, never a fake glyph.
export function supportsSculptedHeading(text) {
  return text.trim().length>0&&[...text.toUpperCase()].every(letter=>letter===' '||!!glyphs[letter]);
}
export function createSculptedHeading(text, width=8, options={}) {
  if(!supportsSculptedHeading(text))throw new Error('Unsupported sculpted heading: '+text);
  if(!Number.isFinite(width)||width<=0)throw new Error('Heading width must be positive and finite');
  const root=new THREE.Group();root.name='Sculpted heading: '+text;
  const edge=new THREE.MeshPhongMaterial({color:0x71401b,emissive:0x301505,emissiveIntensity:.35,shininess:20,flatShading:true});
  const gold=new THREE.MeshPhongMaterial({color:0xffc51c,emissive:0xd48200,emissiveIntensity:.55,specular:0xffef88,shininess:65,flatShading:true});
  if(options.surface)throw new Error('This recipe supports enamel surfaces only');
  const enamel=new THREE.MeshBasicMaterial({color:0xffffff,vertexColors:true});
  let cursor=0,index=0;
  for(const letter of text.toUpperCase()) {
    if(letter===' '){cursor+=.38;continue;}
    const glyph=glyphs[letter],pivot=new THREE.Group();pivot.name='Headline letter '+letter;
    pivot.position.set(cursor+glyph.w/2,Math.sin(index*1.8)*.025,Math.sin(index*2)*.012);
    pivot.rotation.z=Math.sin(index*2.1)*.065;root.add(pivot);
    const faceMaterial=enamel;
    const shapes=[shapeFor(letter),...(glyph.extra??[]).map(outline)];
    for(const shape of shapes){
      const back=extrude(shape,.25,.11,.045);back.translate(-glyph.w/2,0,-.25);
      const rim=extrude(shape,.028,.09,.036);rim.translate(-glyph.w/2,0,.012);
      const face=extrude(shape,.01,.003,.005);face.translate(-glyph.w/2,0,.083);paintFace(face,index,1,letter===','?[-.19,.33]:[0,1],options.facePalette);
      solid(pivot,back,edge);solid(pivot,rim,gold);solid(pivot,face,faceMaterial);
    }
    for(const points of glyph.holes??[]){
      const center=points.reduce((c,p)=>[c[0]+p[0]/points.length,c[1]+p[1]/points.length],[0,0]);
      const scaled=f=>points.map(p=>[center[0]+(p[0]-center[0])*f,center[1]+(p[1]-center[1])*f]);
      const collar=outline(scaled(1.09));collar.holes.push(outline(scaled(.65)));
      const lining=extrude(collar,.25,.003,.003);lining.translate(-glyph.w/2,0,-.15);solid(pivot,lining,gold);
    }
    cursor+=glyph.w+.20;index++;
  }
  root.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(root),center=box.getCenter(new THREE.Vector3());
  for(const child of root.children)child.position.sub(center);
  root.scale.setScalar(width/Math.max(.01,box.max.x-box.min.x));
  return root;
}

