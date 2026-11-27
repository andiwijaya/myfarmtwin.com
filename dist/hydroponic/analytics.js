// Use the same web stream as the MyFarmTwin homepages.
const stream = 'G-VXB9Q1DG4W';
const production = ['myfarmtwin.com', 'www.myfarmtwin.com'].includes(location.hostname);

if (!window.gtag) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  if (production) {
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${stream}`;
    document.head.append(tag);
    window.gtag('js', new Date());
    window.gtag('config', stream);
  }
}

export function track(name, designId, source) {
  window.gtag('event', name, {design_id: designId, entry_source: source, transport_type: 'beacon'});
}

const publishedId = document.body.dataset.hydroDesign;
if (publishedId) track('hydro_design_view', publishedId, new URLSearchParams(location.search).get('from') === 'home' ? 'home' : 'design_page');

document.addEventListener('click', event => {
  const link = event.target instanceof Element ? event.target.closest('a[data-hydro-event]') : null;
  if (link) track(link.dataset.hydroEvent, link.dataset.hydroId, link.dataset.hydroSource);
});
