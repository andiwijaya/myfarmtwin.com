/** Separate presentation area: never adds footprints to the existing crop grid. */
export const CHICKEN_AREA='chicken';
export const YARD=Object.freeze({size:8,fenceMin:1,fenceMax:7});
export const YARD_OBJECTS=Object.freeze({feeder:{x:5,y:4,w:1,d:1},drinker:{x:5,y:2,w:1,d:1},clean:{x:1,y:5,w:1,d:1},ramp:{x:3,y:4,w:1,d:1}});
export const HEN_PATH=Object.freeze([{x:2,y:5},{x:4,y:5},{x:5,y:5},{x:4,y:4}]);
/** @param {number} level */
export const coopFootprint=level=>level>=1?{x:2,y:1,w:3,d:3}:{x:2,y:2,w:2,d:2};
