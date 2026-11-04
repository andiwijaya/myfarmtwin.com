/** Fictional compressed game balance, never real husbandry advice. One tick is the existing farm hour. */
export const GOAT=Object.freeze({starterHayG:6000,hayBagG:6000,hayBagPrice:24,hayStoreMaxG:30000,foodDayG:900,waterDayMl:3000,hotWaterFactor:1.35,growthHours:16*24,readyCondition:.6,minCondition:.2,starterWaterVoucherMl:12000,cleanEffect:20,cleanInterval:6,soilPerGoatDay:2.5,paddockInitialG:6000,paddockMaxG:9000,regrowthDayG:600,paddockPrice:70,weanedPrice:65,careUpgradePrice:80,registryMax:512,historyMax:96});
export const GOAT_SHELTERS=Object.freeze([
 Object.freeze({capacity:4,price:0,feederG:6000,troughMl:20000,shade:.6}),
 Object.freeze({capacity:6,price:100,feederG:9000,troughMl:30000,shade:.8}),
 Object.freeze({capacity:8,price:180,feederG:12000,troughMl:40000,shade:1})
]);
export const GOAT_REWARDS=Object.freeze({'goat.chapter1':20,'goat.healthy':15,'goat.growing':15,'goat.pasture':15,'goat.bigger':20,'goat.contract':20});
export const GOAT_COST_TYPES=Object.freeze(['goat_feed_purchase','goat_purchase','goat_shelter_upgrade','goat_paddock_purchase','goat_care_upgrade']);
export const GOAT_LEDGER_TYPES=Object.freeze([...GOAT_COST_TYPES,'goat_sale','goat_starter_grant']);
export const GOAT_REWARD_IDS=Object.freeze(['goat.chapter1','goat.healthy','goat.growing','goat.pasture','goat.bigger','goat.contract']);
