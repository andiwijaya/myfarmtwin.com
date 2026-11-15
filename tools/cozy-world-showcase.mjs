import {writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createCozyState,dispatchCozy} from '../game/client/cozy-domain.js';
// A synthetic dense-farm QA fixture built entirely through real commands.
// This is never granted to a player or loaded automatically by the game.
let state=createCozyState();const commands=[];
function act(type,args={}){const command={type,...args,revision:state.revision},result=dispatchCozy(state,command);if(!result.ok)throw Error(type+': '+result.error);state=result.state;commands.push(command);return result;}
for(const kind of ['coop','goatShelter','barn','pond']){act('start',{kind});act('feed',{facility:kind});if(kind!=='pond')act('waterFacility',{facility:kind});act('clean',{facility:kind});}
act('collect',{facility:'barn'});act('collect',{facility:'pond'});act('sellAll');act('sellAnimal',{facility:'goatShelter',animal:state.facilities.find(f=>f.id==='goatShelter').animals[0].id});
act('buySeed',{crop:'lettuce',quantity:5});act('buySeed',{crop:'tomato',quantity:8});act('buySeed',{crop:'corn',quantity:8});act('refill',{litres:1000});
for(let plot=0;plot<24;plot++){act('plant',{plot,crop:['lettuce','tomato','corn'][plot%3]});act('water',{plot});}
act('advance',{hours:24});act('buyFeed',{facility:'barn'});act('feed',{facility:'barn'});act('waterFacility',{facility:'barn'});for(const facility of ['coop','goatShelter','barn','pond'])act('clean',{facility});act('advance',{hours:24});
act('collect',{facility:'barn'});act('collect',{facility:'coop'});act('sellAll');act('buyAnimal',{facility:'goatShelter'});act('buyAnimal',{facility:'barn'});
for(const [kind,x,z,rotation]of [['path',-1,1,0],['path',-1,3,0],['path',-1,5,0],['path',-1,7,0],['path',-1,9,0],['path',1,1,0],['path',3,1,0],['path',5,1,0],['path',7,1,0],['banana',-22,4,0],['banana',-22,-9,0],['tree',-25,-7,0],['grass',-18,-8,0],['grass',-18,-5,0],['grass',-18,-2,0]])act('build',{kind,transform:{x,z,rotation}});
const text=JSON.stringify({format:'MyFarmTwinCozyBackup',version:2,state});await mkdir('qa-artifacts/cozy-world/fixture-source',{recursive:true});await writeFile('qa-artifacts/cozy-world/fixture-source/dense-showcase.json',text);await writeFile('qa-artifacts/cozy-world/fixture-source/dense-showcase-recipe.json',JSON.stringify({commands,sha256:createHash('sha256').update(text).digest('hex')},null,2));console.log(JSON.stringify({commands:commands.length,coins:state.coins,plots:state.plots.length,crops:state.plots.filter(p=>p.crop).length,facilities:state.facilities.length,sha256:createHash('sha256').update(text).digest('hex')}));
