import {WORLD_ART} from './unified-world-art.js';
/** @param {string} a @param {string} b @param {number} t */
function mixColor(a,b,t){return'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');}
/** Current native hour/weather only. No clock, forecast, RNG or mutation.
 * Fixed light direction preserves the authored four-view atlas convention.
 * @param {{tick:number,weather:string}} snapshot */
export function worldLighting(snapshot){const hour=((Math.floor(snapshot.tick)%24)+24)%24,ramp=[0,0,0,0,0,.15,.45,.75,1,1,1,1,1,1,1,1,1,.85,.65,.35,.1,0,0,0],day=ramp[hour],weather=snapshot.weather,cloud=weather==='rainy'?.32:weather==='cloudy'?.65:weather==='hot'?1.05:1,phase=hour>=5&&hour<8?'dawn':hour>=17&&hour<21?'dusk':day===0?'night':'day',warm=phase==='dawn'||phase==='dusk',canonical=WORLD_ART.light;
 // Native tick0 remains night. Raise its illustration fill/readability rather
 // than shifting the solar clock or changing the comparison fixture's time.
 let background=mixColor('#d0dcd6',canonical.background,day),spriteTint=mixColor('#d8e0e1','#ffffff',day);if(weather==='rainy'){background=mixColor(background,'#c7d5d5',.28);spriteTint=mixColor(spriteTint,'#cad9d7',.35);}else if(weather==='cloudy'){background=mixColor(background,'#d8e0d8',.2);spriteTint=mixColor(spriteTint,'#e3e9e5',.2);}else if(weather==='hot'){background=mixColor(background,'#ede5cc',.12);spriteTint=mixColor(spriteTint,'#fff4dc',.15);}if(warm)spriteTint=mixColor(spriteTint,'#ffe7c8',.12);
 return Object.freeze({hour,phase,weather,spriteTint,light:Object.freeze({background,sky:mixColor('#e3edec',canonical.sky,day),ground:mixColor('#78916b',canonical.ground,day),hemisphere:Number(((2.05+.55*day)*(weather==='rainy'?.95:1)).toFixed(4)),key:mixColor('#d4e3df',warm?'#ffdcb4':canonical.key,day),keyIntensity:Number(((.6+1.4*day)*cloud).toFixed(4)),keyPosition:canonical.keyPosition})});
}
