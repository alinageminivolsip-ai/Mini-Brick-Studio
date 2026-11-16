# -*- coding: utf-8 -*-
"""Shopping-led layout; retains authored scenes and existing commerce contracts."""
import re
B='/Mini-Brick-Studio/miglik/'
STUDIO='/Mini-Brick-Studio/studio/'
VK='https://vk.com/write-224539480'

def rail(ns,key,items):
    image=ns['image']
    track=key+'-track'
    return f'<div class="collection-rail"><div class="collection-track" id="{track}" data-collection-track aria-label="Подборки подарков">'+''.join(f'<a class="collection-tile" href="{B+path}">{image(photo,"")}<span>{label}</span></a>' for path,label,photo in items)+f'</div><div class="rail-controls" data-collection-controls="{track}" hidden><button type="button" data-process-prev aria-label="Предыдущая подборка" aria-controls="{track}">←</button><output aria-live="polite"></output><button type="button" data-process-next aria-label="Следующая подборка" aria-controls="{track}">→</button></div></div>'

def collections(ns,key='collections'):
    return rail(ns,key,[('podarki/dlya-devushki/','Для пары','editorial/images/occasions/love-480.webp'),('podarki/dlya-podrugi/','Для подруг','editorial/images/occasions/friends-480.webp'),('podarki/na-svadbu/','На свадьбу','editorial/images/occasions/wedding-480.webp'),('podarki/na-godovshchinu/','На годовщину','editorial/images/occasions/anniversary-480.webp'),('miniatura-doma/','Миниатюра дома','editorial/images/occasions/home-480.webp')])

def gift_grid(ns,key='gift-grid',filtered=False):
    image=ns['image']
    items=[('shop/?view=%2Fproduct%2Ftogether','Мы — это счастье','Гирлянда, розы и два героя.','shop/images/together-800.webp','couple','anniversary'),('podarki/na-godovshchinu/','Ваша важная дата','Два героя и музыкальное оформление.','editorial/images/couple-960.webp','couple','anniversary'),('podarki/dlya-podrugi/','Для лучших подруг','Фотография и детали ваших поездок.','editorial/images/friends-960.webp','friend','birthday'),('podarki/na-svadbu/','Свадебная история','Образы молодожёнов и памятная фотография.','editorial/images/wedding-960.webp','couple','wedding')]
    filters=''
    if filtered:
        filters='<div class="gift-filters"><label>Кому<select data-gift-recipient><option value="all">Всем близким</option><option value="couple">Для пары</option><option value="friend">Другу или подруге</option></select></label><label>Повод<select data-gift-occasion><option value="all">Любой повод</option><option value="anniversary">Годовщина</option><option value="birthday">День рождения</option><option value="wedding">Свадьба</option></select></label><button type="button" data-gift-reset>Сбросить</button></div>'
    result=f'<div class="gift-selection" data-gift-selection>{filters}<div class="shopping-grid" id="{key}">'
    for path,title,copy,photo,recipient,occasion in items:
        result+=f'<a class="shopping-card" data-gift-card data-recipient="{recipient}" data-occasion="{occasion}" href="{B+path}"><figure>{image(photo,title)}</figure><div class="shopping-card-copy"><h3>{title}</h3><p>{copy}</p><strong>от 2 490 ₽</strong><span class="shopping-card-action">Выбрать рамку <span aria-hidden="true">↗</span></span></div></a>'
    result+='</div><p class="gift-empty" data-gift-empty hidden>Для этого сочетания пока нет примера. Измените фильтры или сбросьте выбор.</p>'
    if filtered:result+='<p class="selection-status" role="status" data-gift-status>Найдено композиций: 4</p>'
    return result+'</div><p class="selection-note">Визуализации оформления. Итоговая стоимость зависит от комплектации.</p>'

def refine_pages(ns):
    pages=ns['pages'];text=ns['textsection'];steps=ns['step_cards'];image=ns['image']
    for slug in ['ramki-s-minifigurkami/','miniatura-doma/']:
        p=pages[slug]
        p['body']=p['body'].replace('class="mp-hero"','class="mp-hero mp-product-hero"',1)
    p=pages['ramki-s-minifigurkami/']
    p['body']=p['body'].replace('Рамки с минифигурками <em>по вашим фотографиям</em>','Рамки с <em>вашими героями</em>')
    p['body']=p['body'].replace('>Открыть конструктор</a>','>Создать свою рамку</a>',1)
    p=pages['miniatura-doma/'];p['body']=p['body'].replace('3D-миниатюра вашей <em>квартиры или дома</em>','Ваш дом <em>в миниатюре</em>')
    process=steps([('Ваша планировка','Присылаете план и фотографии комнат. По ним обсуждаем будущую миниатюру.','editorial/apartment/key-0.webp'),('Цифровая модель','Создаём 3D-модель с расположением стен, комнат и мебели.','editorial/apartment/key-14.webp'),('3D-печать','Печатаем детали миниатюры на 3D-принтере.'),('Сборка в рамке','Собираем стены, мебель и детали в объёмную композицию.','editorial/apartment/key-60.webp')],label='Изготовление миниатюры',key='house-production')
    process=process.replace('>03</span>', '>03</span><div class="mp-step-placeholder" role="img" aria-label="Место для фотографии процесса 3D-печати">Фото 3D-печати</div>',1)
    # Owner-authorized neutral slot, never a fabricated printer photograph.
    p['body']=p['body'].replace('<h2>Какие детали квартиры можно повторить</h2>','<h2>Комнаты, мебель и ваши детали</h2>')
    p['body']=p['body'].replace('<section class="mp-section mp-copy"><h2>Что потребуется для заказа',text('От планировки до готовой миниатюры','Детали создаём по вашей планировке и печатаем на 3D-принтере.',process)+'<section class="mp-section mp-copy"><h2>Что потребуется для заказа',1)
    # Remove the duplicate still of the same model; preserve animated demonstration above.
    p['body']=re.sub(r'<section class="mp-section mp-copy"><h2>Примеры 3D-миниатюр</h2>[\s\S]*?</section>','',p['body'],count=1)
    p=pages['podarki/'];old=p['body'];picker=re.search(r'<section class="gift-picker[\s\S]*?</section>',old)[0]
    p['body']='<section class="mp-page-title"><h1>Подарки <em>для ваших близких</em></h1><p class="mp-lead">Выберите оформление — героев и личные детали можно изменить.</p></section>'+collections(ns,'gift-collections')+'<section class="mp-section"><h2>Выберите свою рамку</h2>'+gift_grid(ns,'gift-directory',True)+'</section><section class="mp-section"><h2>Подарок для нового дома</h2><p>3D-миниатюра квартиры или дома по вашей планировке. Индивидуальный расчёт.</p>'+ns['button']('miniatura-doma/','Посмотреть миниатюру')+'</section><details class="picker-helper"><summary>Помочь выбрать подарок?</summary>'+picker+'</details>'

def refine_home(home,ns):
    image=ns['image'];steps=ns['step_cards']
    scene=re.search(r'<section class="story"[\s\S]*?</section>',home)[0]
    scene=scene.replace('class="story"','class="story" id="gift-story"',1)
    scene=re.sub(r'<h1>[\s\S]*?</h1>','<h2>От фотографии<br>к <span class="highlight">вашей рамке</span></h2>',scene,count=1)
    scene=re.sub(r'<a class="skip-story"[\s\S]*?</a>','<a class="skip-story" href="#process">Пропустить историю</a>',scene)
    scene=scene.replace('fetchpriority="high"','loading="lazy"')
    scene=re.sub(r'<p>Создаём рамки с фигурками[\s\S]*?</p>','<p>Сначала — любимая фотография. Затем — узнаваемые герои, оформление и подарочная коробка.</p>',scene,count=1)
    # The legacy player binds .brand to its own scene start; keep that hook away from the global logo.
    home=home.replace('class="mp-logo brand" href="#start"','class="mp-logo" href="'+B+'"')
    scene=scene.replace('<div class="stage">','<a class="brand scene-brand-hook" href="#start" hidden tabindex="-1" aria-hidden="true"></a><div class="stage">',1)
    hero_image=image('editorial/images/process/choose-story-800.webp','Рамки MIGLIK для пары, подруг и семьи',False).replace('decoding=', 'fetchpriority="high" decoding=')
    hero=f'<section class="shopping-hero" aria-labelledby="shopping-heading"><div class="shopping-hero-copy"><h1 id="shopping-heading">Подарки с вашей <em>историей</em></h1><p>Рамки с минифигурками по фото и 3D-миниатюры домов.</p><div class="mp-actions"><a class="mp-button" href="{B}podarki/">Выбрать подарок</a><a class="mp-link" href="{STUDIO}">Создать рамку ↗</a></div><p class="hero-price">Рамки — от 2 490 ₽<span>Итог зависит от комплектации</span></p></div><figure>{hero_image}</figure></section>'
    directions='<section class="shopping-section" id="products"><div class="section-top"><h2>Две идеи для <span class="highlight">важного подарка</span></h2></div><div class="direction-grid">'
    for path,title,copy,price,photo,cta in [('ramki-s-minifigurkami/','Рамка с вашими героями','Образы близких, фотография и важные детали.','От 2 490 ₽','editorial/images/couple-960.webp','Посмотреть рамки'),('miniatura-doma/','Дом в миниатюре','Планировка, комнаты и мебель в объёмной рамке.','Индивидуальный расчёт','editorial/apartment/key-60.webp','Посмотреть миниатюры')]:
        directions+=f'<a class="direction-card" href="{B+path}"><figure>{image(photo,title)}</figure><div><h3>{title}</h3><p>{copy}</p><strong>{price}</strong><span class="shopping-card-action">{cta} ↗</span></div></a>'
    directions+='</div></section>'
    selection='<section class="shopping-section" id="stories"><div class="section-top"><h2>С какой рамки <span class="highlight">начнём?</span></h2><a class="mp-link" href="'+B+'shop/?view=%2Fcatalog">Все композиции ↗</a></div>'+gift_grid(ns,'home-gifts')+'</section>'
    # Retain the nodes the authored runtime owns, after the shopping path.
    memory=re.search(r'<section\b[^>]*id="memories"[\s\S]*?</section>',home)[0]
    apartment=re.search(r'<section\b[^>]*id="apartment"[\s\S]*?</section>',home)[0]
    process='<section class="shopping-section process-section editorial-section" id="process"><div class="section-top"><h2>От идеи <span class="highlight">до подарка</span></h2><a class="mp-link" href="'+B+'kak-zakazat/">Как заказать ↗</a></div>'+steps([('Выберите рамку','Начните с размера и оформления.','editorial/images/process/choose-story-800.webp'),('Соберите героев','Подберите внешность, одежду и аксессуары.','editorial/images/process/prepare-photos-800.webp'),('Добавьте личное','Фотографию, надпись и важные детали.','editorial/images/process/personal-details-800.webp'),('Проверьте результат','Сохраните оформление и обсудите заказ.','editorial/images/process/gift-box-800.webp')],key='home-order',label='Шаги заказа')+'</section>'
    process=process.replace('class="mp-step-list"','class="mp-step-list process-list"')
    reviews=ns['section']('reviews');reviews=re.sub(r'<div class="section-heading">[\s\S]*?</div>','<div class="section-top"><h2 id="reviews-heading">Подарки, которые <span class="highlight">радуют</span></h2><a class="mp-link" href="'+B+'otzyvy/">Все отзывы ↗</a></div>',reviews,count=1)
    final=re.search(r'<section\b[^>]*id="your-story"[\s\S]*?</section>',home)[0]
    faq=re.search(r'<section\b[^>]*id="faq"[\s\S]*?</section>',home)[0]
    main=collections(ns)+hero+directions+selection+scene+memory+apartment+process+reviews+final+faq
    home=re.sub(r'(<main id="main"[^>]*>)[\s\S]*?</main>',lambda m:m[1]+main+'</main>',home,count=1)
    home=home.replace('class="authored-home"','class="authored-home shopping-home"')
    return home
