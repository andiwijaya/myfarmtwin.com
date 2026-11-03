import {dispatch} from '../client/engine.js';
export function command(s,type,extra={}){return dispatch(s,{id:s.revision+1,type,...extra});}
