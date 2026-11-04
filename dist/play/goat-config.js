/** Fictional compressed game balance, never real husbandry advice. One tick is the existing farm hour. */
export const GOAT=Object.freeze({starterHayG:6000,hayBagG:6000,hayBagPrice:24,hayStoreMaxG:30000,foodDayG:900,waterDayMl:3000,hotWaterFactor:1.35,growthHours:16*24,readyCondition:.6,starterWaterVoucherMl:12000,cleanEffect:20,cleanInterval:6,soilPerGoatDay:2.5,paddockInitialG:6000,paddockMaxG:9000,regrowthDayG:600,paddockPrice:70,weanedPrice:65,careUpgradePrice:80,registryMax:512,historyMax:96});
export const GOAT_SHELTERS=Object.freeze([
 Object.freeze({capacity:4,price:0,feederG:6000,troughMl:20000,shade:.6}),
 Object.freeze({capacity:6,price:100,feederG:9000,troughMl:30000,shade:.8}),
 Object.freeze({capacity:8,price:180,feederG:12000,troughMl:40000,shade:1})
]);
export const GOAT_REWARD_IDS=Object.freeze(['goat.chapter1','goat.healthy','goat.growing','goat.pasture','goat.bigger','goat.contract']);
