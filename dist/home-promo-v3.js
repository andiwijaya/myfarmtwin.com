/* Set the game language when the player enters from a localized homepage. */
const playLink = document.querySelector('.game-card');
playLink?.addEventListener('click', () => {
  try {
    localStorage.setItem('myfarmtwin.locale', document.documentElement.lang);
  } catch {
    // The game link still works when preference storage is unavailable.
  }
});
