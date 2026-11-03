/** Native isometric projection shared by the additive yard renderer. */
export const iso=(/** @type {number} */x,/** @type {number} */y,/** @type {number} */rotation=0)=>{for(let i=0;i<((rotation%4)+4)%4;i++){const previous=x;x=7-y;y=previous;}return {x:450+(x-y)*44,y:82+(x+y)*22};};
/** @param {number} x @param {number} y @param {number} [w] @param {number} [h] */
export const diamond=(x,y,w=43,h=21)=>`${x},${y-h} ${x+w},${y} ${x},${y+h} ${x-w},${y}`;
