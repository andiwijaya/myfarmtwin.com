/** Presentation geometry only, in the same 8x8 isometric coordinate system. */
/** Stable visual identity even after another goat is sold. @param {string} id */
export const goatOrdinal=id=>id==='goat.starter.adult'?1:id==='goat.starter.young.1'?2:id==='goat.starter.young.2'?3:3+Number(id.split('.').at(-1));
export const GOAT_LAYOUT=Object.freeze({size:8,shelter:{x:1.1,y:1.1,w:2.4,d:1.8},hay:{x:5.5,y:1.7},water:{x:6.1,y:3.1},clean:{x:1.2,y:3.4},pasture:{x:1.1,y:4.1,w:3,d:2.3},platform:{x:5.4,y:5,w:1,d:1},contract:{x:6.3,y:5.9}});
