export const HOUSE_KIND='house';
export const HOUSE_CLEARANCE=10;
export const HOUSE_PLOT=Object.freeze({width:15.6,depth:12.8});
export const HOUSE_SITE=Object.freeze({x:-20,z:-17,rotation:0});

/** @typedef {{model:string,label:readonly [string,string],price:number,dimensions:readonly [number,number,number],entrance:readonly [number,number,number]}} HouseLevel */

/** @type {readonly HouseLevel[]} */
export const HOUSE_LEVELS=Object.freeze([
 {model:'house_1',label:['Rumah papan','Timber cottage'],price:50,dimensions:[4.65,4.5,3.7],entrance:[.71,.22,1.29]},
 {model:'house_2',label:['Rumah bata','Brick cottage'],price:90,dimensions:[5.58,4.98,4.0],entrance:[-1.04,.28,1.57]},
 {model:'house_3',label:['Rumah kampung','Village house'],price:145,dimensions:[6.5,5.7,4.3],entrance:[0,.28,1.70]},
 {model:'house_4',label:['Rumah beranda','Veranda house'],price:220,dimensions:[7.7,6.2,4.7],entrance:[0,.31,1.61]},
 {model:'house_5',label:['Rumah keluarga','Family house'],price:320,dimensions:[8.9,6.8,5.1],entrance:[-.56,.34,1.98]},
 {model:'house_6',label:['Rumah sayap L','L-plan house'],price:470,dimensions:[10.4,8.2,5.1],entrance:[-1.9,.32,1.32]},
 {model:'house_7',label:['Rumah limasan','Limasan house'],price:650,dimensions:[11.5,8.6,5.9],entrance:[0,.40,2.41]},
 {model:'house_8',label:['Rumah dua lantai','Two-storey house'],price:900,dimensions:[12.1,9.7,7.8],entrance:[.86,.35,2.86]},
 {model:'house_9',label:['Rumah pendopo','Pavilion house'],price:1200,dimensions:[13.7,11.2,7.4],entrance:[0,.42,.89]},
 {model:'house_10',label:['Rumah besar tropis','Tropical estate'],price:1550,dimensions:[15.3,12.4,8.7],entrance:[0,.47,3.74]},
]);
