/** @param {{soilWaterMm:number,soilCapacityMm:number}} plot */
export function condition(plot){const pct=100*plot.soilWaterMm/plot.soilCapacityMm;return pct<20?'dry':pct<40?'thirsty':pct>90?'wet':'good';}
import {CROPS,WEATHER} from './config.js';
/** Snapshot estimate; weather and soil change in subsequent ticks. @param {import('./engine.js').State} state @param {import('./engine.js').Plot} plot */
export function estimateHarvest(state,plot){if(!plot.crop)return null;const c=plot.crop,config=CROPS[c.type],status=condition(plot),factor=status==='good'?1:status==='dry'?.2:.65;const quantity=Math.max(1,Math.floor(config.yield*c.quality));return {hours:Math.ceil((1-c.progress)*config.hours/(factor*WEATHER[state.weather].growth)),quantity,revenue:Math.max(1,Math.round(quantity*config.price*c.quality))};}
