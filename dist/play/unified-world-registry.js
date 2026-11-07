/** Presentation coordinates only. Units are illustrative, not engineering measurements.
 * No farm state, simulation clock, grants or command dispatch belongs here.
 */
/** @typedef {{minX:number,maxX:number,minZ:number,maxZ:number}} Bounds */
/** @typedef {{x:number,z:number}} Point */
const point=(/** @type {number} */x,/** @type {number} */z)=>Object.freeze({x,z});
const bounds=(/** @type {number} */minX,/** @type {number} */minZ,/** @type {number} */maxX,/** @type {number} */maxZ)=>Object.freeze({minX,maxX,minZ,maxZ});
/** @param {string} id @param {Readonly<Bounds>} area @param {Readonly<Point>} anchor @param {Readonly<Point>} entry */
const zone=(id,area,anchor,entry)=>Object.freeze({id,bounds:area,anchor,entry});
export const WORLD_BOUNDS=bounds(-20,-25,30,25);
export const FARM_ZONE_IDS=Object.freeze(/** @type {const} */(['field','chicken','goat','cow','fish']));
export const ZONE_REGISTRY=Object.freeze({
 field:zone('field',bounds(-10,1,0,8),point(-4,4),point(-4,2.2)),
 chicken:zone('chicken',bounds(-10,-11,0,-2),point(-4,-6),point(-4,-2.2)),
 goat:zone('goat',bounds(9,-18,25,-6),point(17,-12),point(17,-6.4)),
 cow:zone('cow',bounds(12,3,27,14),point(19,8.5),point(19,3.4)),
 fish:zone('fish',bounds(-2,11,10,25),point(5,18),point(5,11.4)),
 market:zone('market',bounds(3.5,-1.5,6.5,1.5),point(5,0),point(5,1.15)),
 future:zone('future',bounds(-18,12,-4,23),point(-12,17),point(-12,12.4))
});
export const PATH_NODES=Object.freeze({west:point(-12,2.2),field:ZONE_REGISTRY.field.entry,plaza:point(5,2.2),goatTurn:point(17,2.2),cowTurn:point(19,2.2),east:point(25,2.2),chicken:ZONE_REGISTRY.chicken.entry,goat:ZONE_REGISTRY.goat.entry,cow:ZONE_REGISTRY.cow.entry,fish:ZONE_REGISTRY.fish.entry,future:ZONE_REGISTRY.future.entry,market:ZONE_REGISTRY.market.entry});
/** Explicit junctions keep each branch connected without walking through the Market building. */
export const PATH_NETWORK=Object.freeze(/** @type {[keyof typeof PATH_NODES,keyof typeof PATH_NODES][]} */([['west','field'],['field','plaza'],['plaza','goatTurn'],['goatTurn','cowTurn'],['cowTurn','east'],['field','chicken'],['goatTurn','goat'],['cowTurn','cow'],['plaza','fish'],['west','future'],['plaza','market']]).map(([from,to],i)=>Object.freeze({id:'path.'+i,from,to,width:.9})));
// The verified M1 framing remains available while M2 geometry is introduced.
export const TWO_ZONE_BOUNDS=bounds(-11,-11,11,10);
export const TWO_ZONE_ANCHORS=Object.freeze({field:ZONE_REGISTRY.field.anchor,chicken:ZONE_REGISTRY.chicken.anchor,market:ZONE_REGISTRY.market.anchor});
/** @param {string} id @param {number} dx @param {number} dz @returns {Readonly<Point>} */
export function worldPoint(id,dx=0,dz=0){if(!Object.hasOwn(ZONE_REGISTRY,id)||![dx,dz].every(Number.isFinite))throw new RangeError('Invalid world coordinate');const {anchor}=ZONE_REGISTRY[/** @type {keyof typeof ZONE_REGISTRY} */(id)];return point(anchor.x+dx,anchor.z+dz);}
/** @param {Readonly<Bounds>} outer @param {Readonly<Bounds>} inner */
export function containsBounds(outer,inner){return inner.minX>=outer.minX&&inner.maxX<=outer.maxX&&inner.minZ>=outer.minZ&&inner.maxZ<=outer.maxZ;}
/** Positive-area overlap. Touching boundaries are permitted. @param {Readonly<Bounds>} a @param {Readonly<Bounds>} b */
export function overlaps(a,b){return a.minX<b.maxX&&a.maxX>b.minX&&a.minZ<b.maxZ&&a.maxZ>b.minZ;}
/** @param {{x:number,z:number,width:number,depth:number}} entity @returns {Bounds} */
export function footprint(entity){if(![entity.x,entity.z,entity.width,entity.depth].every(Number.isFinite)||entity.width<=0||entity.depth<=0)throw new RangeError('Invalid footprint');return bounds(entity.x-entity.width/2,entity.z-entity.depth/2,entity.x+entity.width/2,entity.z+entity.depth/2);}
