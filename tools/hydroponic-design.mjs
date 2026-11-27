import {readFile} from 'node:fs/promises';
import {calculateDesign, fields} from '../hydroponic/engine.js';

const preset = new URL('../hydroponic/designs/nft-30-lubang.json', import.meta.url);
const [command, ...args] = process.argv.slice(2);

if (command === 'create') {
  const [id, title, ...settings] = args;
  if (!id || !title) throw new Error('Usage: node tools/hydroponic-design.mjs create <slug> <title> [channelCount=4] [holesPerChannel=6]');
  const design = {...JSON.parse(await readFile(preset, 'utf8')), id, title};
  for (const setting of settings) {
    const [key, value, extra] = setting.split('=');
    if (value === undefined || extra !== undefined || (!Object.hasOwn(fields, key) && !['rackRotation', 'tankRotation', 'pump'].includes(key))) throw new Error(`Unsupported option: ${setting}`);
    design[key] = key === 'pump' ? value : Number(value);
  }
  const model = calculateDesign(design);
  if (model.issues.length) throw new Error(model.issues.map(issue => issue.message).join('\n'));
  console.log(JSON.stringify(design, null, 2));
} else if (command === 'validate' || command === 'calculate') {
  const input = args[0] || preset;
  const model = calculateDesign(JSON.parse(await readFile(input, 'utf8')));
  console.log(JSON.stringify(command === 'validate' ? {ok: model.issues.length === 0, id: model.design.id, holes: model.holeCount, issues: model.issues} : model, null, 2));
  if (model.issues.length) process.exitCode = 1;
} else {
  console.error('Usage: node tools/hydroponic-design.mjs <validate|calculate> [design.json]');
  process.exitCode = 1;
}
