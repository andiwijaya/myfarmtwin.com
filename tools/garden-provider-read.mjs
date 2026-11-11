import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import assert from 'node:assert/strict';

// Read existing OAuth credentials only in memory. Never log/store tokens.
const config=await readFile(join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8');
const token=process.env.CLOUDFLARE_API_TOKEN||config.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1];
assert.ok(token,'Existing Cloudflare credential required');
const qa=process.env.QA_DIR||'qa-artifacts/garden/provider';await mkdir(qa,{recursive:true});
const response=await fetch('https://api.cloudflare.com/client/v4/accounts/de3db9734efdbc946c1265eda87842d7/pages/projects/myfarmtwin-com',{headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(30000)});
if(response.status!==200){console.log(JSON.stringify({http:response.status,credentialPrinted:false}));process.exitCode=1;}else{
 const {result:p}=await response.json(),d=p.canonical_deployment||p.production_deployment;
 const out={atUTC:new Date().toISOString(),name:p.name,productionBranch:p.production_branch,domains:p.domains,source:p.source,build:{command:p.build_config?.build_command,output:p.build_config?.destination_dir,root:p.build_config?.root_dir},production:d&&{id:d.id,url:d.url,source:d.deployment_trigger?.metadata?.commit_hash,environment:d.environment,stage:d.latest_stage},credentialPrinted:false,providerSettingsChanged:false};
 await writeFile(join(qa,'project.json'),JSON.stringify(out,null,2));console.log(JSON.stringify(out));
}
