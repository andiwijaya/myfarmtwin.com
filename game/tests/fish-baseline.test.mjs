import {legacyGarden} from './garden-legacy-helper.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {deserialize} from '../client/save-schema.js';
const base=new URL('./fixtures/fish-v4/',import.meta.url),manifest=JSON.parse(readFileSync(new URL('manifest.json',base),'utf8'));
test('frozen actual V4 sources and synthetic saves retain exact bytes',()=>{for(const f of manifest.fixtures){const raw=readFileSync(new URL(f.name,base));assert.equal(createHash('sha256').update(raw).digest('hex'),f.sha256);const old=JSON.parse(raw).state,next=deserialize(raw.toString());for(const k of Object.keys(old))if(k!=='saveVersion')assert.deepEqual(legacyGarden(next)[k],old[k],k);}for(const r of manifest.readers)assert.equal(createHash('sha256').update(readFileSync(new URL('rollback/'+r.name+'.txt',base))).digest('hex'),r.sha256);});
