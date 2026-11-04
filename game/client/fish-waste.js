/** TAN is total ammonia nitrogen, never unionized NH3. All rates are fictional. @param {import('./fish-state.js').FishPond} pond @param {number} eatenG @param {import('./engine.js').Weather} weather */
export function stepFishWaste(pond,eatenG,weather){const decomposed=Math.min(pond.sludgeG,pond.sludgeG>0?Math.max(1,Math.floor(pond.sludgeG/48)):0);pond.sludgeG-=decomposed;pond.balance.sludgeDecomposedG+=decomposed;const added=(eatenG+decomposed)*2;pond.tanMg+=added;pond.balance.tanInMg+=added;
 // Background biological conversion consumes oxygen; nitrogen leaves the TAN compartment, not the whole ecosystem.
 const converted=Math.min(Math.floor(pond.tanMg/200),Math.floor(pond.oxygenMg/4));pond.tanMg-=converted;pond.balance.tanRemovedMg+=converted;pond.balance.tanConvertedMg+=converted;pond.oxygenMg-=converted*4;pond.balance.oxygenUsedMg+=converted*4;
 const target=weather==='hot'?3100:weather==='rainy'?2500:weather==='cloudy'?2600:2700;pond.tempCentiC+=Math.sign(target-pond.tempCentiC)*Math.min(10,Math.abs(target-pond.tempCentiC));return {addedMg:added,convertedMg:converted,decomposedG:decomposed};}
/** Visual clarity is not an oxygen/safety classifier. @param {import('./fish-state.js').FishPond} pond */
export const fishClarity=pond=>Math.max(0,Math.min(1000,1000-pond.sludgeG*2-Math.floor(pond.tanMg/20)));
