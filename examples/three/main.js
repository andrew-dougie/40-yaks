import {createSculptedHeading,facePalettes} from './lettering.js';
import {createStudio,frameHeading} from './studio.js';
const {renderer,scene}=createStudio(document.querySelector('canvas'));
const heading=createSculptedHeading('40 YAKS',8,{facePalette:facePalettes.title});
heading.rotation.set(-.045,.10,0);scene.add(heading);
const camera=frameHeading(heading,renderer);
renderer.render(scene,camera);
