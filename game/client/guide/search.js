const commonWords = new Set(['cara', 'dan', 'di', 'ke', 'pada', 'untuk', 'yang']);
const topicSelector = 'section[id], [data-guide-topic][id]';

/** @param {string} text */
function words(text) {
  return text.normalize('NFKD').toLowerCase().replace(/\p{M}/gu, '').match(/[\p{L}\p{N}]+/gu) ?? [];
}

/** @param {string} text */
function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function indexTopics() {
  const chapters = document.getElementById('panduan');
  return Array.from(chapters?.querySelectorAll(topicSelector) ?? [], topic => {
    const title = cleanText(topic.querySelector('h2, h3')?.textContent ?? '');
    const excerpts = Array.from(topic.querySelectorAll('p, li, tbody tr'))
      .filter(block => block.closest(topicSelector) === topic)
      .map(block => {
        const content = block instanceof HTMLTableRowElement
          ? Array.from(block.cells, cell => cell.textContent).join(' · ')
          : block.textContent;
        const text = cleanText(content ?? '');
        return {text, words: words(text)};
      });
    return {
      id: topic.id,
      title,
      titleWords: words(title),
      aliases: words(topic.id + ' ' + (topic.getAttribute('data-search-terms') ?? '')),
      bodyWords: excerpts.flatMap(excerpt => excerpt.words),
      excerpts,
    };
  });
}

/** @typedef {ReturnType<typeof indexTopics>[number]} Topic */

/** @param {string[]} indexed @param {string} word @param {number} weight */
function wordScore(indexed, word, weight) {
  if (indexed.includes(word)) return weight + 1;
  return indexed.some(part => part.startsWith(word)) ? weight : 0;
}

/** @param {Topic} topic @param {string[]} query */
function rank(topic, query) {
  let score = 0;
  for (const word of query) {
    const match = Math.max(
      wordScore(topic.titleWords, word, 8),
      wordScore(topic.aliases, word, 4),
      wordScore(topic.bodyWords, word, 1),
    );
    if (!match) return 0;
    score += match;
  }
  return score;
}

/** @param {Topic} topic @param {string[]} query */
function bestExcerpt(topic, query) {
  let best = topic.excerpts[0];
  let highest = 0;
  for (const excerpt of topic.excerpts) {
    const score = query.reduce((total, word) => total + wordScore(excerpt.words, word, 1), 0);
    if (score > highest) {
      best = excerpt;
      highest = score;
    }
  }
  return best?.text ?? '';
}

/** @param {Topic} topic @param {string[]} query */
function resultItem(topic, query) {
  const item = document.createElement('li');
  const link = document.createElement('a');
  const title = document.createElement('strong');
  const excerpt = document.createElement('span');
  link.href = '#' + topic.id;
  title.textContent = topic.title;
  excerpt.textContent = bestExcerpt(topic, query);
  link.append(title, excerpt);
  item.append(link);
  return item;
}

const search = document.getElementById('guide-search');
const input = document.getElementById('guide-query');
const clear = document.getElementById('guide-search-clear');
const status = document.getElementById('guide-search-status');
const results = document.getElementById('guide-search-results');

if (search && input instanceof HTMLInputElement && clear instanceof HTMLButtonElement && status && results) {
  const topics = indexTopics();
  const update = () => {
    const text = input.value.trim();
    const query = [...new Set(words(text).filter(word => !commonWords.has(word)))];
    const matches = query.length
      ? topics.map(topic => ({topic, score: rank(topic, query)}))
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score || a.topic.titleWords.length - b.topic.titleWords.length)
      : [];

    results.replaceChildren(...matches.map(({topic}) => resultItem(topic, query)));
    results.hidden = !matches.length;
    clear.hidden = !input.value;
    status.textContent = matches.length
      ? matches.length + ' topik ditemukan.'
      : text ? 'Tidak ada topik yang cocok. Coba kata lain.' : '';
  };

  input.addEventListener('input', update);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.isComposing) results.querySelector('a')?.click();
  });
  clear.addEventListener('click', () => {
    input.value = '';
    update();
    input.focus();
  });
  update();
  search.hidden = false;
}

export {};
