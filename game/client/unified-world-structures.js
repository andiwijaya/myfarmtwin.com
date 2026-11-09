import {cowBarnParts} from './unified-cow-barn.js';
import {chickenCoopParts} from './unified-cozy-chicken.js';
import {goatShelterParts} from './unified-cozy-goat.js';
import {marketParts} from './unified-cozy-market.js';
/** Existing owned building IDs only; renderer art never grants a building.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e
 * @returns {import('./unified-world-environment.js').EnvironmentPart[]} */
export function structureParts(e){
 if(e.kind==='cowBarn')return cowBarnParts(e);
 if(e.kind==='coop')return chickenCoopParts(e);
 if(e.kind==='goatShelter')return goatShelterParts(e);
 return e.kind==='market'?marketParts(e):[];
}
