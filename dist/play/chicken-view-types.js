/** Shared native chicken care snapshot, independent of any renderer.
 * @typedef {{id:string,activity:'idle'|'walk'|'peck'|'drink'|'roost'}} HenView
 * @typedef {{level:number,doorOpen:boolean,pendingEggs:number,shade?:boolean,autoFeeder?:boolean,autoOn?:boolean,hens?:HenView[],feedG?:number,waterL?:number,cleanliness?:number}} YardSnapshot
 */
export {};
