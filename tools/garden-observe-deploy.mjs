import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
const [sha,environment]=process.argv.slice(2);assert.match(sha||'',/^[a-f0-9]{40}$/);assert.ok(['preview','production'].includes(environment));
const config=await readFile(join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8'),token=config.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1];assert.ok(token);
const qa=process.env.QA_DIR||'qa-artifacts/garden/deployment';await mkdir(qa,{recursive:true});
let last='',accepted;
for(let n=0;n<72;n++){
 const r=await fetch('https://api.cloudflare.com/client/v4/accounts/de3db9734efdbc946c1265eda87842d7/pages/projects/myfarmtwin-com/deployments?per_page=25',{headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);
 const data=await r.json();assert.equal(data.success,true);const d=data.result.find(d=>d.deployment_trigger?.metadata?.commit_hash===sha&&d.environment===environment);
 if(d){const out={atUTC:new Date().toISOString(),id:d.id,url:d.url,aliases:d.aliases,environment:d.environment,source:d.deployment_trigger?.metadata?.commit_hash,branch:d.deployment_trigger?.metadata?.branch,stage:d.latest_stage,stages:d.stages};const text=JSON.stringify(out.stage);if(text!==last){console.log(JSON.stringify(out));last=text;}await writeFile(join(qa,'deployment.json'),JSON.stringify(out,null,2));if(d.latest_stage.status==='success'){accepted=out;break;}assert.ok(!['failure','canceled'].includes(d.latest_stage.status),'Deployment failed');}
 await new Promise(r=>setTimeout(r,5000));
}
assert.ok(accepted,'Deployment did not reach success in the bounded observation window');
