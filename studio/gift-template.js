/* Catalog entry is restricted to a known template, hero and frame variant. */
const togetherBackground = togetherGift.background;
const studioGiftTemplate = (() => {
  const url = new URL(location.href);
  const query = url.searchParams;
  if (query.get('template') !== togetherGift.id) return null;
  const hero = query.get('hero');
  const size = query.get('size');
  const color = query.get('color');
  const frameOverride = Object.hasOwn(togetherGift.sizes, size) && ['white', 'black'].includes(color)
    ? color + '-' + togetherGift.sizes[size] : null;

  // The hand-off applies once. Reloads retain the frame last edited in Studio.
  if (query.has('size') || query.has('color')) {
    query.delete('size');
    query.delete('color');
    history.replaceState(history.state, '', url);
  }

  return {
    id: togetherGift.id,
    hero: hero === '1' ? 0 : hero === '2' ? 1 : null,
    frame: 'white-small',
    frameOverride,
    background: togetherBackground,
    people: togetherGift.people
  };
})();
