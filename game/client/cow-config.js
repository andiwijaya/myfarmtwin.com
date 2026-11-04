/** Fictional game balance, never actual farming or milk-handling advice. */
export const COW=Object.freeze({balanceVersion:'cow.v1.1-b1',careScale:1000,conditionFloor:200,careResponse:4,comfortResponse:6,conditionResponse:48,conditionYieldBase:600,soilPerCowDay:3,basicHeatRelief:600,starterFeedG:32000,starterWaterMl:180000,openingMilkMl:4000,reservoirMl:10000,feedDayG:8000,waterDayMl:30000,hotWaterDayMl:45000,yieldDayMl:6000,feedBagG:8000,feedBagPrice:12,feedStoreMaxG:96000,feedTroughG:24000,waterTroughMl:100000,upgradedWaterTroughMl:150000,canMl:20000,coolerMl:40000,troughPrice:90,coolerPrice:120,expansionPrice:180,cowPrice:240,shadePrice:100,sanitationPrice:80,energyPrice:1,energyTicks:6,decay:100,cooledDecay:25,sessionSpacing:8,sessionsDay:2,lotsMax:128,historyMax:96});
export const COW_PRICES=Object.freeze({A:6,B:4,C:3});
export const COW_COST_TYPES=Object.freeze(['cow_feed_purchase','cow_trough_upgrade','cow_cooler_purchase','cow_barn_upgrade','cow_purchase','cow_shade_upgrade','cow_sanitation_upgrade','cow_energy']);
export const COW_LEDGER_TYPES=Object.freeze([...COW_COST_TYPES,'cow_starter_grant','cow_milk_sale','cow_order_bonus']);
export const COW_STAGE_FACTOR=Object.freeze({early:950,mid:1000,late:850});
export const COW_COMFORT_WEIGHTS=Object.freeze({nutrition:25,hydration:25,cleanliness:25,rest:5,heat:20});
