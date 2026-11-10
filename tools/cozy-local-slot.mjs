import assert from 'node:assert/strict';
/** Local-only QA. Calling this never launches a browser or reserves a slot. */
export function cozyLocalSlot(){
 assert.equal(process.env.COZY_QA_SLOT,'parent-confirmed','Coordinate with parent; Zebra has priority');
 const end=Date.parse(process.env.COZY_SLOT_END_UTC||''),stop=Date.parse(process.env.COZY_WORK_STOP_UTC||'');
 assert.ok(/Z$/.test(process.env.COZY_SLOT_END_UTC||'')&&end>Date.now()&&end-Date.now()<=15*60_000,'Fresh coordinated deadline, at most15 minutes');
 assert.ok(/Z$/.test(process.env.COZY_WORK_STOP_UTC||'')&&stop>Date.now()&&end<=stop,'Current daily work cutoff must bound the slot');
 assert.ok(!process.env.BASE_URL,'This candidate test is isolated loopback only');return end;
}
