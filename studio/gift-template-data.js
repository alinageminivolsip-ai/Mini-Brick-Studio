/* Shared by the catalog preview and the editable Studio draft. */
const togetherGift = {
  id: 'together',
  background: {
    id: 'gift-together',
    name: 'Мы — это счастье',
    src: './assets/backgrounds/templates/together-small.svg'
  },
  sizes: { M: 'small', L: 'square', XL: 'big' },
  people: [
    { name: 'Левый герой', face: 'A2', hair: 'f5', torso: 2, legs: 7, frameX: 40, frameY: 63 },
    { name: 'Правый герой', face: 'A4', hair: 'm1', torso: 7, legs: 2, frameX: 60, frameY: 63 }
  ],
  palette: { 2: '#F2EFE6', 7: '#111111', 15: '#FFD200' }
};

function togetherBackgroundFor(size) {
  const format = ['small', 'square', 'big'].includes(size) ? size : 'small';
  return './assets/backgrounds/templates/together-' + format + '.svg';
}
