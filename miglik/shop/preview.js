import catalog from './demo-catalog.js';

const home = '/Mini-Brick-Studio/miglik/';
const storefront = home + 'shop/';
const pages = new Set(['/catalog', '/cart', '/checkout', '/account', '/how', '/about', '/delivery', '/gallery']);
const documents = new Map([
  ['/legal','legal'], ['/privacy','privacy'], ['/cookies','cookies'],
  ['/returns','returns'], ['/terms','terms'], ['/contacts','contacts'],
  ['/consent/login','consent-login'], ['/consent/order','consent-order']
]);
const catalogRoute = path => pages.has(path) || /^\/(product|gifts)\/[a-z-]+$/.test(path);
export const previewRoute = () => {
  const view = new URLSearchParams(location.search).get('view');
  return view && catalogRoute(view) ? view : '/catalog';
};
export function previewURL(path) {
  if (path === '/' || path.startsWith('/#')) return home + path.slice(1);
  if (path === '/builder') return '/Mini-Brick-Studio/studio/';
  if (documents.has(path)) return storefront + documents.get(path) + '.html';
  return storefront + '?view=' + encodeURIComponent(path);
}
export function rewriteLinks(root) {
  for (const link of root.querySelectorAll('a[href^="/"]')) {
    const path = link.getAttribute('href');
    if (!catalogRoute(path) && !documents.has(path) && path !== '/' && path !== '/builder' && !path.startsWith('/#')) continue;
    if (catalogRoute(path) && !link.hasAttribute('data-native')) link.dataset.previewRoute = path;
    link.href = previewURL(path);
  }
}

function quote(items, promo) {
  if (promo) throw Error('Промокоды доступны в рабочем магазине.');
  const variants = new Map();
  const itemKeys = [];
  for (const item of items || []) {
    const product = catalog.products.find(entry => entry.id === item.productId);
    const variant = product?.variants.find(entry => entry.id === item.variantId);
    if (item.type !== 'product' || !variant || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw Error('Выберите вариант из демонстрационного каталога.');
    }
    const key = 'product:' + variant.id;
    const entry = variants.get(key) || { key, unitPrice: variant.price, quantity: 0, demo: true, eligible: product.discountEligible !== false };
    entry.quantity += item.quantity;
    if (entry.quantity > catalog.settings.maxQuantity) throw Error('Слишком много копий.');
    variants.set(key, entry);
    itemKeys.push(key);
  }
  const lines = [...variants.values()].map(entry => {
    const rule = [...catalog.settings.discounts].reverse().find(candidate => candidate.min <= entry.quantity);
    const discount = entry.eligible ? rule?.percent || 0 : 0;
    const before = entry.quantity * entry.unitPrice;
    const total = Math.round(before * (100 - discount) / 100);
    return { ...entry, discount, before, total, saving: before - total, discountedUnit: Math.round(entry.unitPrice * (100 - discount) / 100) };
  });
  const sum = field => lines.reduce((result, line) => result + line[field], 0);
  return {lines, itemKeys, before: sum('before'), total: sum('total'), saving: sum('saving')};
}
export async function previewApi(url, body) {
  if (url === '/api/session') return {mode: 'closed', user: null, localTestLogin: false, emailStatus: {enabled: false}};
  if (url === '/api/catalog') return catalog;
  if (url === '/api/quote') return quote(body?.items, body?.promo);
  throw Error('Это демонстрация. Вход и отправка заявок отключены.');
}
