import {track} from '../hydroponic/analytics.js';

const fromHome = new URLSearchParams(location.search).get('from') === 'home';
track('food_article_view','singkong',fromHome ? 'home' : 'article');
