import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { startServer } from './serve.mjs';

const canonicalOrigin = 'https://myfarmtwin.com';
const server = process.env.BASE_URL ? null : await startServer(0);
const base = process.env.BASE_URL || `http://127.0.0.1:${server.address().port}`;
const sitemapUrl = `${canonicalOrigin}/sitemap.xml`;

async function get(path) {
  return fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(15000) });
}

function tags(html, pattern) {
  return [...html.matchAll(pattern)].map(match => match[1]);
}

try {
  const [robots, sitemap, missing] = await Promise.all([
    get('/robots.txt'), get('/sitemap.xml'), get('/seo-audit-page-that-does-not-exist-20261125'),
  ]);
  assert.equal(robots.status, 200);
  assert.match(robots.headers.get('content-type'), /text\/plain/);
  const rules = await robots.text();
  assert.ok(rules.includes(`Sitemap: ${sitemapUrl}`));
  assert.doesNotMatch(rules, /^Disallow:\s*\S/m);
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get('content-type'), /xml/);
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /<h1>Page not found<\/h1>/);

  const xml = await sitemap.text();
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  const listed = tags(xml, /<loc>([^<]+)<\/loc>/g);
  assert.equal(new Set(listed).size, listed.length, 'Duplicate sitemap URLs');
  const files = await readdir('dist', { recursive: true });
  const routes = files.map(file => file.replaceAll('\\', '/'))
    .filter(file => /(?:^|\/)index\.html$/.test(file))
    .map(file => `/${file.slice(0, -'index.html'.length)}`);

  const pages = new Map(await Promise.all(routes.map(async route => {
    const response = await get(route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get('content-type'), /text\/html/, route);
    const html = await response.text();
    const canonicals = tags(html, /<link rel="canonical" href="([^"]+)"/g);
    assert.ok(canonicals.length <= 1, route);
    const robotsTags = tags(html, /<meta name="(?:robots|googlebot)" content="([^"]+)"/gi);
    const noindex = /\b(?:noindex|none)\b/i.test([...robotsTags, response.headers.get('x-robots-tag')].join(' '));
    const anchors = tags(html, /<a\b[^>]*\bhref="([^"]+)"/gi)
      .map(link => new URL(link, `${canonicalOrigin}${route}`))
      .filter(link => link.origin === canonicalOrigin);
    if (!noindex) assert.ok(canonicals[0]?.startsWith(`${canonicalOrigin}/`), route);
    return [route, { html, canonical: canonicals[0], noindex, anchors }];
  })));

  const eligible = [...pages].filter(([route, page]) => !page.noindex && page.canonical === `${canonicalOrigin}${route}`);
  assert.deepEqual([...listed].sort(), eligible.map(([, page]) => page.canonical).sort());
  for (const route of ['/', '/id/', '/learn/', '/about/', '/play/', '/play/guide/']) {
    assert.ok(listed.includes(`${canonicalOrigin}${route}`), `${route} must be indexable`);
  }
  for (const route of ['/play/cozy/', '/play/glb/']) {
    assert.equal(pages.get(route).canonical, `${canonicalOrigin}/play/`, route);
  }
  for (const route of ['/grow/', '/farm/', '/kitchen/', '/projects/', '/gear/', '/play/recovery/', '/play/integrity/']) {
    assert.ok(pages.get(route).noindex, `${route} must be excluded from indexing`);
  }

  const titles = new Set();
  const descriptions = new Set();
  const resources = new Map();
  const discovered = new Set(['/']);
  for (const route of discovered) {
    for (const link of pages.get(route)?.anchors ?? []) {
      if (pages.has(link.pathname)) discovered.add(link.pathname);
    }
  }
  for (const [route, { html, anchors, canonical }] of eligible) {
    assert.ok(discovered.has(route), `Orphan sitemap page ${route}`);
    const [title] = tags(html, /<title>([^<]+)<\/title>/g);
    const [description] = tags(html, /<meta name="description" content="([^"]+)"/g);
    assert.ok(title?.includes('MyFarmTwin') && !titles.has(title), route);
    assert.ok(description && !descriptions.has(description), route);
    titles.add(title);
    descriptions.add(description);
    assert.equal(tags(html, /(<h1\b)/gi).length, 1, route);
    assert.deepEqual(tags(html, /<meta property="og:url" content="([^"]+)"/g), [canonical], route);
    const [image] = tags(html, /<meta property="og:image" content="([^"]+)"/g);
    assert.equal(new URL(image).origin, canonicalOrigin, route);

    for (const link of anchors) {
      if (pages.has(link.pathname) && link.hash) {
        assert.ok(pages.get(link.pathname).html.includes(`id="${decodeURIComponent(link.hash.slice(1))}"`), link.href);
      }
      if (!pages.has(link.pathname)) resources.set(link.pathname, 'image/');
    }
    resources.set(new URL(image).pathname, 'image/');
  }
  await Promise.all([...resources].map(async ([path, type]) => {
    const response = await get(path);
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get('content-type')?.startsWith(type), path);
    await response.body?.cancel();
  }));

  const expectedAlternates = ['en:/', 'id:/id/', 'x-default:/'];
  for (const [route, language] of [['/', 'en'], ['/id/', 'id']]) {
    const { html, anchors } = pages.get(route);
    assert.ok(html.includes(`<html lang="${language}">`), route);
    const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
      .map(([, lang, url]) => {
        assert.equal(new URL(url).origin, canonicalOrigin);
        return `${lang}:${new URL(url).pathname}`;
      });
    assert.deepEqual(alternates.sort(), [...expectedAlternates].sort(), route);
    assert.ok(anchors.some(link => link.pathname === (language === 'id' ? '/' : '/id/')), route);
    assert.ok(html.includes('G-VXB9Q1DG4W'), `Missing homepage analytics on ${route}`);
  }

  const [site] = tags(pages.get('/').html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g).map(JSON.parse);
  assert.equal(site['@type'], 'WebSite');
  assert.equal(site.url, `${canonicalOrigin}/`);
  const [guide] = tags(pages.get('/play/guide/').html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g).map(JSON.parse);
  assert.deepEqual(guide['@graph'].map(item => item['@type']), ['Article', 'BreadcrumbList']);
  for (const item of guide['@graph'][1].itemListElement) assert.ok(listed.includes(item.item), item.item);
  console.log(`SEO verified on ${base}: ${routes.length} HTML routes, ${listed.length} sitemap URLs, ${resources.size} linked images, true HTTP 404.`);
} finally {
  if (server) {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
