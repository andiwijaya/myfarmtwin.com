const english = document.documentElement.lang === 'en';
const labels = english ? {
  heading: 'Share design', link: 'Design link', copy: 'Copy link', system: 'Share via device', close: 'Close',
  copied: 'Link copied.', manual: 'The link is selected. Copy it to share.'
} : {
  heading: 'Bagikan desain', link: 'Tautan desain', copy: 'Salin tautan', system: 'Bagikan lewat perangkat', close: 'Tutup',
  copied: 'Tautan disalin.', manual: 'Tautan sudah dipilih. Salin untuk membagikannya.'
};

const dialog = document.createElement('dialog');
dialog.id = 'design-share-dialog';
dialog.className = 'design-share-dialog';
dialog.setAttribute('aria-labelledby', 'design-share-heading');
dialog.innerHTML = `<form method="dialog"><button class="share-action share-close" type="submit">${labels.close}</button></form>
  <h2 id="design-share-heading">${labels.heading}</h2><p class="share-design-name"></p>
  <label class="share-label">${labels.link}<input type="url" readonly></label>
  <div class="share-actions"><button class="share-action share-copy" type="button" autofocus>${labels.copy}</button><button class="share-action share-system" type="button" hidden>${labels.system}</button></div>
  <p class="share-notice" role="status"></p>`;
document.body.append(dialog);

const designName = dialog.querySelector('.share-design-name');
const field = dialog.querySelector('input');
const copy = dialog.querySelector('.share-copy');
const system = dialog.querySelector('.share-system');
const status = dialog.querySelector('.share-notice');
let trigger;

document.addEventListener('click', event => {
  const button = event.target instanceof Element ? event.target.closest('button[data-share-path]') : null;
  if (!button) return;
  const path = button.dataset.sharePath;
  if (!/^\/hydroponic\/desain\/[a-z0-9-]+\/$/.test(path)) return;
  trigger = button;
  designName.textContent = button.dataset.shareTitle;
  field.value = `https://myfarmtwin.com${path}`;
  status.textContent = '';
  system.hidden = typeof navigator.share !== 'function';
  if (!dialog.open) dialog.showModal();
});

function selectLink() {
  field.focus();
  field.select();
  status.textContent = labels.manual;
}

copy.addEventListener('click', async () => {
  const link = field.value;
  try {
    await navigator.clipboard.writeText(link);
    if (dialog.open && field.value === link) status.textContent = labels.copied;
  } catch {
    if (dialog.open && field.value === link) selectLink();
  }
});

system.addEventListener('click', async () => {
  try {
    await navigator.share({title: designName.textContent, url: field.value});
  } catch (error) {
    if (dialog.open && error.name !== 'AbortError') selectLink();
  }
});

dialog.addEventListener('close', () => trigger?.focus({preventScroll:true}));
