import {createHash} from 'node:crypto';
import {mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {articles} from '../hydroponic/articles.js';
import {calculateDesign} from '../hydroponic/engine.js';
import {posterSvg} from '../hydroponic/drawings.js';
import {articlePage, articleUrl, designPage, designUrl, galleryPage, homepageFragment, plannerPage, posterUrl} from '../hydroponic/pages.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const mainDesign = 'nft-30-lubang';
const digest = contents => createHash('sha256').update(contents).digest('hex');
const lf = value => value.replaceAll('\r\n', '\n');

function upsertBlock(contents, name, fragment, anchor, before = true) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  const section = `${start}\n${fragment}\n${end}`;
  const hasBlock = contents.includes(start);
  if (hasBlock && contents.includes(end)) {
    const first = contents.indexOf(start);
    const last = contents.indexOf(end, first);
    if (last < first || contents.indexOf(start, first + start.length) !== -1 || contents.indexOf(end, last + end.length) !== -1) throw new Error(`Invalid ${name} markers`);
    return contents.slice(0, first) + section + contents.slice(last + end.length);
  }
  if (hasBlock || contents.includes(end) || contents.split(anchor).length !== 2) throw new Error(`Missing or ambiguous ${name} anchor`);
  return contents.replace(anchor, before ? `${section}\n${anchor}` : `${anchor}\n${section}`);
}

async function readDesigns() {
  const source = join(root, 'hydroponic', 'designs');
  const files = (await readdir(source)).filter(file => file.endsWith('.json')).sort();
  const models = await Promise.all(files.map(async file => {
    const d = JSON.parse(await readFile(join(source, file), 'utf8'));
    const model = calculateDesign(d);
    if (`${d.id}.json` !== file) throw new Error(`Filename must match design ID: ${file}`);
    if (model.issues.length) throw new Error(`${file}: ${model.issues.map(issue => issue.message).join('\n')}`);
    return model;
  }));
  const first = models.find(model => model.design.id === mainDesign);
  if (first?.holeCount !== 30) throw new Error('The launch design must have exactly 30 planting holes.');
  return [first, ...models.filter(model => model !== first)];
}

const homeHead = `  <link rel="stylesheet" href="/hydroponic/home.css">`;
const homeNames = {
  '/index.html': ['Hydroponic Planner & 3D Farming Game', 'Design a real hydroponic rack and print your plan, or play MyFarmTwin, a free 3D farm game set in tropical Indonesia.'],
  '/id/index.html': ['Desain Hidroponik & Game Pertanian 3D', 'Rancang dan cetak desain hidroponik ukuran nyata atau mainkan game simulasi pertanian 3D MyFarmTwin berlatar Indonesia.']
};

export async function buildHydroponic() {
  const models = await readDesigns();
  const dist = join(root, 'dist');
  const files = new Map();
  const addPage = (path, body) => files.set(`${path}index.html`, body.replace(/[ \t]+$/gm, ''));
  addPage('/hydroponic/', galleryPage(models));
  addPage('/hydroponic/planner/', plannerPage(models));
  for (const model of models) {
    const d = model.design;
    addPage(designUrl(d.id), designPage(model));
    files.set(posterUrl(d), `${posterSvg(model)}\n`);
  }
  for (const article of articles) addPage(articleUrl(article.id), articlePage(article, models[0]));

  for (const name of ['analytics.js', 'planner.js', 'drawings.js', 'engine.js', 'style.css', 'home.css']) {
    files.set(`/hydroponic/${name}`, lf(await readFile(join(root, 'hydroponic', name), 'utf8')));
  }
  const bundle = await build({absWorkingDir: root, entryPoints: ['hydroponic/view3d.js'], bundle: true, minify: true,
    write: false, format: 'esm', target: 'es2022', legalComments: 'none', logLevel: 'silent'});
  files.set('/hydroponic/view3d.js', bundle.outputFiles[0].text);
  files.set('/hydroponic/three-license.txt', lf(await readFile(join(root, 'node_modules', 'three', 'LICENSE'), 'utf8')));

  for (const [path, [title, description]] of Object.entries(homeNames)) {
    const current = lf(await readFile(join(dist, `.${path}`), 'utf8'));
    const withHead = upsertBlock(current, 'hydro-assets', homeHead, '</head>');
    const withSection = upsertBlock(withHead, 'hydro-gallery', homepageFragment(models, path === '/index.html'), '<main id="main" class="home-main">', false);
    const updated = withSection.replace(/<title>[^<]*<\/title>/, `<title>MyFarmTwin — ${title.replaceAll('&', '&amp;')}</title>`)
      .replace(/(<meta name="description" content=")[^"]*/, `$1${description}`)
      .replace(/(<meta property="og:title" content=")[^"]*/, `$1MyFarmTwin — ${title.replaceAll('&', '&amp;')}`)
      .replace(/(<meta property="og:description" content=")[^"]*/, `$1${description}`)
      .replace('>Skip to game</a>', '>Skip to content</a>').replace('>Langsung ke game</a>', '>Langsung ke isi</a>');
    files.set(path, updated);
  }

  const sitemap = lf(await readFile(join(dist, 'sitemap.xml'), 'utf8'));
  const publicPaths = ['/hydroponic/', ...models.map(model => designUrl(model.design.id)), ...articles.map(article => articleUrl(article.id))];
  files.set('/sitemap.xml', upsertBlock(sitemap, 'hydro-pages', publicPaths.map(path => `  <url><loc>https://myfarmtwin.com${path}</loc></url>`).join('\n'), '</urlset>'));

  files.set('/hydroponic/build-info.json', `${JSON.stringify({schema: 1, designs: models.map(model => ({id: model.design.id, revision: model.design.revision, holes: model.holeCount})),
    sha256: Object.fromEntries([...files].map(([path, contents]) => [path, digest(contents)]))}, null, 2)}\n`);
  for (const [path, contents] of files) {
    const destination = resolve(dist, `.${path}`);
    await mkdir(dirname(destination), {recursive: true});
    await writeFile(destination, contents, 'utf8');
  }
  console.log(`Hydroponic Planner built: ${models.length} designs, ${articles.length} articles, ${files.size} outputs.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await buildHydroponic();
