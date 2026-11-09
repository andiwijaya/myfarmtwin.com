import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {deserialize,serialize} from '../game/client/save-schema.js';
import {worldLighting} from '../game/client/unified-world-lighting.js';

// Read retained evidence only. This does not launch a renderer or rerun QA.
const source=process.env.COZY_WEATHER_EVIDENCE||'qa-artifacts/cozy-world-v1/overview-cow-budget',qa=process.env.QA_DIR||'qa-artifacts/cozy-world-v1/d02-weather-audit';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex'),raw=await readFile(source+'/matrix.json'),report=JSON.parse(raw),receipt=hash(JSON.stringify(JSON.parse(await readFile('dist/play/build-info.json','utf8'))));
assert.equal(report.receiptSHA256,receipt,'Retained evidence must identify the current built package');assert.equal(report.withWeather,true);assert.equal(report.profiles.length,24);assert.equal(report.failure,undefined);assert.equal(report.slotExpired,false);assert.deepEqual(report.errors,[]);
const profiles=report.profiles.filter(p=>p.name.includes('-weather-')),cases=[],phases=new Set(),weathers=new Set();assert.equal(profiles.length,20);
for(const name of ['sunny-0','sunny-7','sunny-12','sunny-18','rainy-0','rainy-12','hot-0','hot-12','cloudy-0','cloudy-12']){
 const fixture=await readFile(`${source}/weather-${name}.json`,'utf8'),state=deserialize(fixture),before=serialize(state),lighting=worldLighting(state);
 assert.equal(state.paused,true);assert.equal(`${state.weather}-${state.tick%24}`,name);phases.add(lighting.phase);weathers.add(state.weather);
 for(const device of ['desktop','phone']){
  const p=profiles.find(p=>p.name===`${device}-weather-${name}`);assert.ok(p);assert.equal(p.captures.length,4);assert.equal(p.saveExact,true);assert.equal(p.reloadExact,true);assert.deepEqual(p.captures.map(c=>c.heading),[0,1,2,3]);
  for(const capture of p.captures){assert.equal(capture.phase,lighting.phase);for(const key of ['background','sky','key'])assert.equal(capture.light[key],lighting.light[key]);assert.equal(capture.quality,'auto');}
 }
 assert.equal(serialize(state),before);cases.push({name,tick:state.tick,weather:state.weather,phase:lighting.phase,fixtureSHA256:hash(fixture),spriteTint:lighting.spriteTint,light:lighting.light,retainedCaptureCount:8});
}
assert.deepEqual([...phases].sort(),['dawn','day','dusk','night']);assert.deepEqual([...weathers].sort(),['cloudy','hot','rainy','sunny']);
const out={receiptSHA256:receipt,retainedMatrix:{path:source+'/matrix.json',sha256:hash(raw)},profiles:20,captures:80,cases,passed:true,newBrowserRun:false,D02Accepted:false,scope:'CPU inspection of completed current-package retained native fixtures, four-heading scene light properties/phase and exact save/reload flags. Focus-view skyPixel samples may hit terrain and are not reinterpreted as background-color proof. Original matrix source separately asserted background pixels at fit time; that transient fit sample was not persisted here. Motion/static/clock browser gate remains pending.'};
await mkdir(qa,{recursive:true});await writeFile(qa+'/weather-audit.json',JSON.stringify(out,null,2));console.log(JSON.stringify({passed:true,receipt,profiles:20,captures:80,phases:[...phases],weathers:[...weathers],newBrowserRun:false,D02Accepted:false}));
