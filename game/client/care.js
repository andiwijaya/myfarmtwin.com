/** @param {{soilWaterMm:number,soilCapacityMm:number}} plot */
export function condition(plot){const pct=100*plot.soilWaterMm/plot.soilCapacityMm;return pct<20?'dry':pct<40?'thirsty':pct>90?'wet':'good';}
