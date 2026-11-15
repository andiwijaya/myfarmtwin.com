/** Cloudflare Pages applies matching rules in order, joins repeated values,
 * and permits a later '! Header' operation to remove an earlier value.
 * https://developers.cloudflare.com/pages/configuration/headers/
 */
export function parseHeaderRules(text){
 const rules=[];let rule=null;
 for(const line of text.split(/\r?\n/)){
  if(!line.trim()||line.trim().startsWith('#'))continue;
  if(!/^\s/.test(line)){rule={pattern:line.trim(),operations:[]};rules.push(rule);continue;}
  if(!rule)continue;const value=line.trim();
  if(value.startsWith('! ')){rule.operations.push({name:value.slice(2).trim().toLowerCase(),remove:true});continue;}
  const colon=value.indexOf(':');if(colon>0)rule.operations.push({name:value.slice(0,colon).trim().toLowerCase(),value:value.slice(colon+1).trim()});
 }
 return rules;
}
export function headersForPath(rules,path){
 const headers={};
 for(const rule of rules){
  if(!(rule.pattern.endsWith('*')?path.startsWith(rule.pattern.slice(0,-1)):path===rule.pattern))continue;
  for(const op of rule.operations){if(op.remove)delete headers[op.name];else headers[op.name]=headers[op.name]===undefined?op.value:headers[op.name]+', '+op.value;}
 }
 return headers;
}
