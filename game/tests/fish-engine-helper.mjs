import {readFileSync} from 'node:fs';
import {FEATURES} from '../client/features.js';
/** Isolated test-only ESM instance. The actual application flags stay unchanged; only this isolated test instance receives the requested override. */
export async function fishEngine(fish=true){const flags='data:text/javascript;base64,'+Buffer.from('export const FEATURES=Object.freeze('+JSON.stringify({...FEATURES,fish})+');').toString('base64');const source=readFileSync(new URL('../client/engine.js',import.meta.url),'utf8').replaceAll(/(['"])\.\/([^'"]+)\1/g,(_,quote,name)=>JSON.stringify(name==='features.js'?flags:new URL('../client/'+name,import.meta.url).href));return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));}
