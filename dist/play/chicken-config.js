/** Fictional game balance; g/L per game-day, not operational husbandry advice. */
export const CHICKEN=Object.freeze({starterFeedG:2000,feedBagG:2000,feedBagPrice:24,feedStoreMaxG:20000,feedPerHenDayG:110,waterPerHenDayL:.3,hotWater:1.5,shadeHotWater:1.1,soilPerHenDay:4,layChance:.85,cleanPrice:1,cleanIntervalHours:6,henPrice:45,autoPrice:140,shadePrice:70,autoCost:1,eggInventoryMax:80,historyMax:48,chapterReward:20,healthyReward:15,biggerReward:15,orderCount:4,orderBonus:12,aidFeedG:220,aidWaterL:6});
export const COOP_LEVELS=Object.freeze([{capacity:2,nests:4,feedG:2000,waterL:6,price:0},{capacity:4,nests:6,feedG:3000,waterL:8,price:90},{capacity:6,nests:8,feedG:4000,waterL:10,price:160}]);
export const EGG_PRICES=Object.freeze({A:6,B:4,C:3});
export const WELFARE=Object.freeze({recovery:.2,feedWeight:.3,waterWeight:.35,hygieneWeight:.2,spaceWeight:.1,shelterWeight:.05,hotShelter:.65,healthy:.8});
export const CHICKEN_GRANTS=Object.freeze(['chicken.starter.v1','chicken.chapter1','chicken.rescue','chicken.healthy','chicken.bigger','chicken.order.first']);
