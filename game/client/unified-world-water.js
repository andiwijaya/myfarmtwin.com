import {WORLD_ART} from './unified-world-art.js';
/** Five bounded appearance steps, not a second water-quality formula.
 * @param {number|undefined} clarity */
export function waterStyle(clarity){const known=Number.isFinite(clarity),step=known?Math.round(Math.max(0,Math.min(1000,/** @type {number} */(clarity)))/250):2;return{known,step,water:['#899968','#809975','#779a85','#6d9b95','#649ba5'][step],fishTint:['#d5dfc1','#d9e4cc','#dde9d7','#e1eee2','#e4f3ed'][step],filmOpacity:.14-step*.015,glintOpacity:.08+step*.025};}
/** Subtle surface detail stays inside the owned pond and outside core school slots.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} pond
 * @returns {import('./unified-world-environment.js').EnvironmentPart[]} */
export function pondSurfaceParts(pond){const s=waterStyle(pond.clarity),y=WORLD_ART.species.fish.waterPlane,parts=/** @type {import('./unified-world-environment.js').EnvironmentPart[]} */([{x:0,y,z:0,width:pond.width-.45,height:.002,depth:pond.depth-.45,color:s.water,opacity:s.filmOpacity,feature:'water-film'}]);
 for(const [i,side]of [-1,1].entries()){const x=side*1.3,z=side*2.05;parts.push({x,y:y+.008,z:-side*2.25,width:.55,height:.002,depth:.025,color:'#d5e6d7',opacity:s.glintOpacity,fine:true,feature:'water-glint'});if(pond.value>0)for(let n=0;n<8;n++){const a=n*Math.PI/4,b=(n+1)*Math.PI/4,x0=Math.cos(a)*.3,z0=Math.sin(a)*.2,x1=Math.cos(b)*.3,z1=Math.sin(b)*.2;parts.push({x:x+(x0+x1)/2,y:y+.007,z:z+(z0+z1)/2,width:Math.hypot(x1-x0,z1-z0),height:.002,depth:.014,rotation:-Math.atan2(z1-z0,x1-x0),color:'#b4d0be',opacity:.1,fine:true,feature:'water-ripple-'+i});}}return parts;
}
/** One cosmetic sample in the existing RAF; no tick, forecast or resources.
 * @param {number} time @param {number} index @param {boolean} still */
export function waterMotion(time,index,still){const p=time/1800+index*1.7;return{scale:still?1:1+.045*Math.sin(p),x:still?0:.025*Math.sin(p*.7),z:still?0:.025*Math.cos(p*.7)};}
