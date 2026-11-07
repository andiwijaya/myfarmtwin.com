import {dispatch,pumpCovers} from '../game/client/engine.js';import {deserialize,serialize} from '../game/client/save-schema.js';
/** Synthetic QA farm built only through unchanged engine commands and paid upgrades. */
export function makeOwnedCropFarm(raw){
 let state=deserialize(raw);const commands=[],stages={lettuce:new Set(),tomato:new Set()};
 function act(type,extra={}){const command={id:state.revision+1,type,...extra},result=dispatch(state,command);if(!result.ok)throw Error('Crop QA '+type+': '+result.error);state=result.state;commands.push(command);for(const p of state.plots)if(p.crop)stages[p.crop.type].add(p.crop.stage);}
 if(!state.pump.built)act('buyPump');while(state.plots.length<8)act('expand');if(state.pump.on)act('togglePump');
 function plant(id,crop){if(state.seeds[crop]===0)act('buySeed',{crop});act('plant',{plot:id,crop});if(state.water<25)act('refill');act('water',{plot:id});}
 function advance(id,stage){let n=0;while(state.plots.find(p=>p.id===id).crop.stage<stage){if(n++>144)throw Error('Bounded native crop growth did not finish');for(const p of [...state.plots])if(p.crop&&p.crop.progress<1&&p.soilWaterMm<22&&p.lastWaterTick!==state.tick){if(state.water<25)act('refill');act('water',{plot:p.id});}act('tick');}}
 plant(3,'lettuce');if(state.paused)act('pause');advance(3,2);plant(4,'tomato');advance(4,1);plant(5,'lettuce');if(!state.paused)act('pause');
 return {state,commands,coveredPlotIds:state.plots.filter(pumpCovers).map(p=>p.id),stagesObserved:Object.fromEntries(Object.entries(stages).map(([id,set])=>[id,[...set].sort()])),raw:serialize(state)};
}
