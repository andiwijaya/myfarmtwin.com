import {WORLD_ART} from './unified-world-art.js';
/** Shared environmental roles. The authored atlas contract stays byte-stable. */
export const WORLD_STYLE=Object.freeze({
 ground:'#97b866',path:'#cdb07e',soil:WORLD_ART.palette.soil,wetSoil:'#644b36',
 wood:WORLD_ART.palette.wood,roof:WORLD_ART.palette.roof,leaf:WORLD_ART.palette.leaf,
 water:WORLD_ART.palette.water,stone:'#a6a17f',trunk:'#876247',
 text:'#234b3b',surface:'#fff9e8',accent:'#f3ce68',
 scale:Object.freeze({unit:'existing farm layout unit',bed:.92,henHeight:.73,goatHeight:1.3,cowHeight:1.8,maxStructureHeight:4}),
 projection:WORLD_ART.projection,light:WORLD_ART.light
});
