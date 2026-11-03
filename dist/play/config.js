/** All values are fictional game balance, not real agriculture prices. */
export const STARTER=Object.freeze({coins:120,water:120,seeds:3});
export const INITIAL_PLOTS=Object.freeze([{id:0,x:2,y:3},{id:1,x:3,y:3},{id:2,x:4,y:3}]);
export const CROP_IDS=Object.freeze(/** @type {const} */(['lettuce','tomato']));
export const STAGE_KEYS=Object.freeze(['seedling','sprout','growing','readyHarvest']);
export const WATER=Object.freeze({amountMm:25,coinCost:2,tankCapacity:240,refillLitres:100,refillCost:6});
export const WEATHER=Object.freeze({sunny:{rainMmDay:0,et:1,growth:1},cloudy:{rainMmDay:0,et:.75,growth:.95},rainy:{rainMmDay:20,et:.6,growth:.85},hot:{rainMmDay:0,et:1.5,growth:.85}});
export const LIMITS=Object.freeze({inventory:80,plots:8});
/** @typedef {{hours:number,waterPerDayMm:number,seedPrice:number,yield:number,price:number,stages:number[]}} CropConfig */
/** @type {Readonly<Record<'lettuce'|'tomato',CropConfig>>} */
export const CROPS=Object.freeze({lettuce:{hours:48,waterPerDayMm:12,seedPrice:8,yield:3,price:16,stages:[0,.12,.48,1]},tomato:{hours:96,waterPerDayMm:18,seedPrice:14,yield:4,price:27,stages:[0,.12,.48,1]}});
