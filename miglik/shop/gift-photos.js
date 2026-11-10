// Coordinates are relative to the uncropped author photograph.
export const studioURL = '/Mini-Brick-Studio/studio/';

export const giftPhotos = {
  together: {
    image: './images/together-800.webp',
    srcset: './images/together-480.webp 480w, ./images/together-800.webp 800w',
    width: 1199,
    height: 1312,
    alt: 'Белая рамка с гирляндой, двумя фигурками, красными розами и надписью «Мы — это счастье»',
    heroes: [
      { number: 1, label: 'левая фигурка', edge: 49.8, top: 36, width: 16, height: 24, align: 'end' },
      { number: 2, label: 'правая фигурка', edge: 50.2, top: 36, width: 19, height: 24, align: 'start' }
    ]
  }
};

export function giftStudioURL(productId, hero, variant) {
  const query = new URLSearchParams({template: productId});
  if (hero) query.set('hero', hero);
  if (variant) {
    query.set('size', variant.size);
    query.set('color', variant.color);
  }
  return studioURL + '?' + query.toString();
}
