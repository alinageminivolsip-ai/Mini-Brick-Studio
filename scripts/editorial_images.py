"""Owner supplied editorial photos around the existing MIGLIK shopping flow."""

B = '/Mini-Brick-Studio/miglik/'
STUDIO = '/Mini-Brick-Studio/studio/'


def photo(name, alt, width, height, cls='', eager=False):
    base = B + 'editorial/integration/' + name
    return (f'<figure class="editorial-photo {cls}" data-editorial-reveal>'
            f'<span class="editorial-photo-inner"><picture>'
            f'<source type="image/webp" srcset="{base}.webp">'
            f'<img src="{base}.png" width="{width}" height="{height}" '
            f'alt="{alt}" loading="{"eager" if eager else "lazy"}" decoding="async" '
            f'sizes="(max-width: 767px) 92vw, 60vw"></picture></span></figure>')


def add_to_pages(pages):
    frames = pages['ramki-s-minifigurkami/']
    sizes = (
        '<section class="editorial-layout editorial-sizes mp-section" id="editorial-sizes" aria-labelledby="editorial-sizes-title">'
        '<div class="editorial-copy"><p class="editorial-kicker">Рамки MIGLIK</p>'
        '<h2 id="editorial-sizes-title">Размеры и детали</h2>'
        '<p>Три размера рамки. Фигурки в каждом остаются высотой 40 мм.</p>'
        '<ul class="editorial-sizes-list"><li><strong>M</strong><span>165 × 215 мм</span></li>'
        '<li><strong>L</strong><span>215 × 215 мм</span></li>'
        '<li><strong>XL</strong><span>215 × 305 мм</span></li></ul>'
        '<p>В конструкторе можно выбрать причёски, одежду и аксессуары.</p>'
        f'<a class="mp-link" href="{STUDIO}">Собрать своих героев ↗</a></div>'
        '<div class="editorial-collage" aria-label="Три рамки и детали фигурок">'
        + photo('three-sizes', 'Три рамки MIGLIK разных размеров на светлом фоне', 1672, 941, 'editorial-collage-main')
        + photo('minifigure-macro', 'Крупный план минифигурки в кремовой одежде и очках', 1086, 1448, 'editorial-collage-detail')
        + '<span class="editorial-badge">Детали крупным планом</span></div></section>'
    )
    marker = '<section class="mp-section mp-copy"><h2>Что можно добавить в оформление'
    frames['body'] = frames['body'].replace(marker, sizes + marker, 1)
    interior = (
        '<section class="editorial-layout editorial-dresser mp-section" id="editorial-dresser" aria-labelledby="editorial-dresser-title">'
        + photo('dresser', 'Персональная рамка с двумя минифигурками на деревянном комоде', 1122, 1402, 'editorial-single')
        + '<div class="editorial-copy"><p class="editorial-kicker">В интерьере</p>'
        '<h2 id="editorial-dresser-title">Рамка дома</h2>'
        '<p>Компактную композицию можно поставить на полку или комод. Выберите размер и соберите своих героев.</p>'
        f'<a class="mp-link" href="{STUDIO}">Создать свою рамку ↗</a></div></section>'
    )
    marker = '<section class="mp-section mp-copy"><h2>Как оформить заказ'
    frames['body'] = frames['body'].replace(marker, interior + marker, 1)

    examples = pages['primery/']
    living = (
        '<section class="editorial-layout editorial-living mp-section" id="editorial-living" aria-labelledby="editorial-living-title">'
        '<div class="editorial-copy"><p class="editorial-kicker">Рамка в доме</p>'
        '<h2 id="editorial-living-title">Как выглядит готовая рамка</h2>'
        '<p>Персональная композиция на столике в гостиной. Образы и детали можно выбрать для своей истории.</p>'
        f'<a class="mp-link" href="{B}ramki-s-minifigurkami/">Посмотреть рамки ↗</a></div>'
        + photo('living-room', 'Белая рамка с двумя минифигурками на стеклянном столике в гостиной', 1086, 1448, 'editorial-single')
        + '</section>'
    )
    examples['body'] = examples['body'].replace('<section class="mp-section examples-section">', living + '<section class="mp-section examples-section">', 1)


def add_to_home(home):
    collection = (
        '<section class="editorial-layout editorial-collection shopping-section" id="editorial-collection" aria-labelledby="editorial-collection-title">'
        + photo('collection', 'Три белые рамки MIGLIK с минифигурками для пары и семьи', 1448, 1086, 'editorial-single')
        + '<div class="editorial-copy"><p class="editorial-kicker">Рамки MIGLIK</p>'
        '<h2 id="editorial-collection-title">Ваша история в рамке</h2>'
        '<p>Герои, дата и детали, которые узнают только ваши близкие. Выберите размер рамки.</p>'
        '<p class="editorial-price">От 2 490 ₽ <span>Итог зависит от комплектации.</span></p>'
        f'<a class="mp-button" href="{B}ramki-s-minifigurkami/">Посмотреть рамки</a></div></section>'
    )
    return home.replace('<section class="shopping-section" id="stories">', collection + '<section class="shopping-section" id="stories">', 1)
