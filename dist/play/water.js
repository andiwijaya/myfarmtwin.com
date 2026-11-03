/** @param {number} n @param {number} low @param {number} high */
export const clamp=(n,low,high)=>Math.max(low,Math.min(high,n));
/** All terms in mm over the same 1m² bed: 1 mm equals 1 litre. Educational approximation.
 * @param {{waterMm:number,capacityMm:number,rainMm?:number,irrigationMm?:number,etMm:number}} input */
export function waterBalance({waterMm,capacityMm,rainMm=0,irrigationMm=0,etMm}){
 if(![waterMm,capacityMm,rainMm,irrigationMm,etMm].every(Number.isFinite)||capacityMm<=0||rainMm<0||irrigationMm<0||etMm<0)throw new Error('Invalid water units');
 const supplied=clamp(waterMm,0,capacityMm)+rainMm+irrigationMm;
 const overflow=Math.max(0,supplied-capacityMm),drainageMm=overflow+Math.max(0,Math.min(supplied,capacityMm)-capacityMm*.9)*.12;
 const next=clamp(supplied-etMm-drainageMm,0,capacityMm),moisturePercent=100*next/capacityMm;
 const waterFactor=moisturePercent<20?.2:moisturePercent<40?.65:moisturePercent>90?.65:1;
 return {waterMm:next,drainageMm,moisturePercent,waterFactor};
}
