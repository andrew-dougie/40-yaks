// Compare the portable recipe against a separately checked-out source renderer.
import {createRequire} from 'node:module';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
if(!process.argv[2])throw new Error('Usage: npm run verify:3d -- /path/to/lil-miners-ruin');
const source=path.resolve(process.argv[2]);
const require=createRequire(path.join(source,'package.json'));
const {build}=require('esbuild');
const temp=await mkdtemp(path.join(tmpdir(),'yaks-parity-'));
const glyphs=JSON.parse(await readFile(path.join(root,'sources/game-glyphs.json'),'utf8'));
const code=`
import assert from 'node:assert/strict';
import * as THREE from 'three';
import * as original from ${JSON.stringify(path.join(source,'Games/LilMinersRuin/src/title-logo.js'))};
import * as portable from ${JSON.stringify(path.join(root,'examples/three/lettering.js'))};
function material(m){const v=m.toJSON();delete v.uuid;delete v.metadata;return v;}
function snapshot(root){
 root.updateMatrixWorld(true);const items=[];
 root.traverse(n=>items.push({type:n.type,visible:n.visible,castShadow:n.castShadow,receiveShadow:n.receiveShadow,
  matrix:n.matrix.toArray(),world:n.matrixWorld.toArray(),
  geometry:n.geometry?{attributes:Object.fromEntries(Object.entries(n.geometry.attributes).map(([k,v])=>[k,{size:v.itemSize,array:Array.from(v.array)}])),index:n.geometry.index?Array.from(n.geometry.index.array):null,groups:n.geometry.groups}:null,
  materials:n.material?[n.material].flat().map(material):null}));return items;
}
function dispose(root){const materials=new Set();root.traverse(n=>{n.geometry?.dispose();if(n.material)[n.material].flat().forEach(m=>materials.add(m));});materials.forEach(m=>m.dispose());}
const cases=${JSON.stringify([...Object.keys(glyphs),'40 YAKS','I 1','NEW HIGH SCORE!',"MINER'S RUIN",'B O 8,','lowercase','  TWO  SPACES  '])};
let comparisons=0;
for(const text of cases)for(const facePalette of [undefined,...Object.values(portable.facePalettes)]){
 const a=original.createSculptedHeading(text,8,{facePalette});
 const b=portable.createSculptedHeading(text,8,{facePalette});
 assert.deepEqual(snapshot(b),snapshot(a),text);comparisons++;dispose(a);dispose(b);
}
for(const invalid of ['', '   ', '@'])assert.equal(portable.supportsSculptedHeading(invalid),false);
for(const invalid of [0,-1,NaN,Infinity])assert.throws(()=>portable.createSculptedHeading('A',invalid));
const a=new original.TitleLogo(new THREE.Scene()),b=new portable.TitleLogo(new THREE.Scene());
assert.deepEqual(snapshot(b.root),snapshot(a.root));comparisons++;
const camera=new THREE.PerspectiveCamera(47,390/844,.1,65);camera.position.set(0,3,10);camera.lookAt(0,3,0);
for(const reduced of [false,true])for(const visible of [true,false,true])for(const dt of [0,1/60,.5,2]){
 for(const title of [a,b])title.update(dt,visible,reduced,camera,{x:.1,y:.05,width:.8,height:.35},.7);
 assert.deepEqual(snapshot(b.root),snapshot(a.root));comparisons++;
}
for(const title of [a,b])title.opening({settled:false,arrival:.4,turn:.2,scale:.9,wordOffsets:[.1,.2,.3],flare:.5});
assert.deepEqual(snapshot(b.root),snapshot(a.root));comparisons++;
dispose(a.root);dispose(b.root);
console.log(comparisons+' exact geometry/material/transform comparisons passed (all 43 contours, palettes, title, candle, motion).');
`;
try{
 await build({stdin:{contents:code,resolveDir:root},bundle:true,platform:'node',format:'esm',outfile:path.join(temp,'verify.mjs'),
  alias:{three:require.resolve('three').replace('/build/three.cjs','/build/three.module.js')},nodePaths:[path.join(source,'node_modules')]});
 await import(pathToFileURL(path.join(temp,'verify.mjs')).href);
}finally{await rm(temp,{recursive:true,force:true});}
