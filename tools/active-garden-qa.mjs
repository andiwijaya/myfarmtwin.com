import {activateGarden} from '../game/client/active-garden.js';
import {deserialize as readSave,serialize} from '../game/client/save-schema.js';
import {makeFullWorldFarm as makeLegacyFullWorldFarm} from './unified-full-farm.mjs';
// Browser oracles include the same additive layout upgrade as SaveSession.load.
// Frozen native-format tests keep using the pure historical deserializer.
export const deserialize=raw=>activateGarden(readSave(raw));
export function makeFullWorldFarm(raw){const farm=makeLegacyFullWorldFarm(raw),state=activateGarden(farm.state);return {...farm,state,raw:serialize(state)};}
