import {createState} from '../client/engine.js';import {createChickenState,createCoop} from '../client/chicken-state.js';
/** Synthetic active domain fixture, not the real starter grant command introduced in M3. */
export function chickenFixture(){const s=createState(),c=createChickenState();s.chicken=c;c.visited=true;c.coop=createCoop(0);c.hens=[1,2].map(n=>({id:'chicken.hen.'+n,adultLayer:true,lastLayDay:0}));c.nextHen=3;c.feedStoreG=2000;c.stats.feedGrantedG=2000;c.grants=['chicken.starter.v1'];c.mission.step=1;return s;}
