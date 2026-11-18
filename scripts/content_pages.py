# -*- coding: utf-8 -*-
"""Content-first refinement of existing pages; no editor or commerce model changes."""
import re
B='/Mini-Brick-Studio/miglik/'
STUDIO='/Mini-Brick-Studio/studio/'
VK='https://vk.com/write-224539480'
PRICE='От 2 490 ₽. Итоговая стоимость зависит от комплектации.'
SIZES=[('M',165,215),('L',215,215),('XL',215,305)]

def size_selector():
    return '<div class="size-selector" data-size-selector><div class="size-options" role="group" aria-label="Размер рамки">'+''.join(f'<button type="button" data-size="{name}" aria-pressed="{str(i==0).lower()}" aria-label="Размер {name}: {w} на {h} миллиметров"><span class="size-drawing" style="--frame-w:{w};--frame-h:{h}" aria-hidden="true"></span><strong>{name}</strong><span>{w} × {h} мм</span></button>' for i,(name,w,h) in enumerate(SIZES))+'</div><p class="size-status" aria-live="polite">Выбран M — 165 × 215 мм.</p><p class="size-help">Внешние габариты рамки. Схемы показывают пропорции; фотографии оформления не растягиваются.</p></div>'

def apply_content(ns):
    pages=ns['pages']; image=ns['image']; hero=ns['hero']; section=ns['section']; text=ns['textsection']; cards=ns['cards']; steps=ns['step_cards']; link=ns['link']; button=ns['button']; faq_base=ns['faq']
    def faq(title,items,contact=True): return faq_base(items,contact=contact).replace('<h2>Частые вопросы</h2>',f'<h2>{title}</h2>')
    def cta(label,url=STUDIO): return f'<a class="mp-button" href="{url}">{label}</a>'
    def setpage(path,h1,body,desc,title=None,index=None):
        p=pages[path];p.update(title=title or h1+' | MIGLIK',desc=desc,body=body)
        if index is not None:p['index']=index
    def heading(h1,desc=''):return f'<section class="mp-page-title"><h1>{h1}</h1>'+ (f'<p class="mp-lead">{desc}</p>' if desc else '')+'</section>'
    frame_faq=[('Сколько стоит рамка?',PRICE),('Какие размеры есть?','M — 165 × 215 мм, L — 215 × 215 мм, XL — 215 × 305 мм. Это внешние габариты рамок.'),('Можно выбрать внешность фигурок?','Да. В конструкторе доступны лица, причёски, одежда и аксессуары из каталога.'),('Как передать заказ?','Сохраните оформление в конструкторе и передайте детали MIGLIK ВКонтакте. Способ оплаты и получения согласуется в переписке.')]
    home_faq=[('Нужна планировка?','Пришлите планировку и фотографии комнат. Если чертежа нет, напишите нам — обсудим, какие материалы подойдут.'),('Как рассчитывается цена?','Индивидуально: стоимость зависит от размера, сложности планировки и количества деталей.'),('Как изготавливается миниатюра?','По планировке создаём цифровую 3D-модель, печатаем детали на 3D-принтере и собираем композицию в рамке.')]
    examples=[('podarki/na-godovshchinu/','Рамка для пары','Две минифигурки, дата и музыкальное оформление.','editorial/images/couple-960.webp'),('podarki/dlya-podrugi/','Рамка для подруг','Минифигурки, фотография и детали поездки.','editorial/images/friends-960.webp'),('podarki/na-svadbu/','Свадебная рамка','Образы молодожёнов, фотография и дата.','editorial/images/wedding-960.webp')]
    body=hero('Рамки с минифигурками <em>по вашим фотографиям</em>','Соберите маленькие версии себя и близких: выберите образы, размер рамки и оформление.','editorial/images/couple-960.webp','Визуализация рамки с двумя минифигурками',cta('Открыть конструктор'))
    body=body.replace('<div class="mp-actions">',f'<p class="product-price">{PRICE}</p><div class="mp-actions">',1)
    body+=text('Как создать фигурки, похожие на вас','Выбирайте лица, причёски, одежду и аксессуары из каталога.',steps([('Внешность','Подберите лицо, оттенок кожи и причёску.'),('Одежда','Выберите верх, ноги и цвета образа.'),('Аксессуары','Добавьте доступные детали из каталога.')],key='frame-options',label='Настройки минифигурок'))
    body+=text('Выберите размер рамки','M и XL — прямоугольные, L — квадратная.',size_selector())
    body+=text('Что можно добавить в оформление','Фотографию и надпись можно настроить в конструкторе. Музыкальное оформление, дату и дополнительный декор обсудите при заказе.',image('editorial/images/process/personal-details-800.webp','Билет, записка и другие примеры личных деталей оформления'))
    body+=text('Что входит в стоимость',PRICE+' Состав оформления и упаковку уточните до заказа.')
    body+='<section class="mp-section"><h2>Примеры рамок</h2><p>Визуализации вариантов оформления.</p>'+cards(examples)+'</section>'
    body+=text('Как оформить заказ','Соберите рамку, проверьте результат и стоимость, сохраните оформление и передайте детали ВКонтакте.',cta('Создать рамку'))+faq('Вопросы о рамках',frame_faq)
    setpage('ramki-s-minifigurkami/','Рамки с минифигурками по вашим фотографиям',body,'Рамки с минифигурками от 2 490 ₽: размеры M/L/XL, выбор лиц, причёсок, одежды и оформление в конструкторе.',title='Рамки с минифигурками по фото — от 2 490 ₽ | MIGLIK')
    body=hero('3D-миниатюра вашей <em>квартиры или дома</em>','Воссоздаём планировку, мебель и детали интерьера в объёмной миниатюре по вашим материалам.','editorial/apartment/key-60.webp','Визуализация миниатюры квартиры в рамке',cta('Обсудить миниатюру',VK))
    body=body.replace('<div class="mp-actions">','<p class="product-price">Индивидуальный расчёт стоимости.</p><div class="mp-actions">',1)
    body+=text('Какие детали квартиры можно повторить','Расположение комнат, мебель и характерные предметы. Возможную детализацию обсуждаем по вашим материалам.')
    apartment=section('apartment')
    apartment=re.sub(r'<h2 id="apartment-heading"[^>]*>[\s\S]*?</h2>','<h2 id="apartment-heading">Как мы создаём 3D-миниатюру</h2>',apartment,count=1)
    apartment=re.sub(r'<p class="kicker">.*?</p>','',apartment)
    apartment=re.sub(r'<p class="section-lead">.*?</p>','<p class="section-lead">Планировка → 3D-модель → мебель и детали → рамка.</p>',apartment)
    apartment=re.sub(r'<p class="quiet-copy">.*?</p>','<p class="quiet-copy">Создаём модель по планировке, печатаем детали на 3D-принтере и собираем миниатюру.</p>',apartment)
    apartment=re.sub(r'<a class="text-link"[\s\S]*?</a>','',apartment,count=1)
    apartment=re.sub(r'<p class="image-note">.*?</p>','<p class="image-note">Визуализация этапов. Детали вашего проекта обсуждаются отдельно.</p>',apartment)
    body+=apartment+text('Что потребуется для заказа','Планировка, фотографии комнат и пожелания. Если чертежа нет, напишите нам — обсудим возможные варианты.')
    body+=text('Примеры 3D-миниатюр','Визуализация миниатюры квартиры в рамке; не фотография выполненного заказа.',image('editorial/apartment/key-60.webp','Визуализация объёмной миниатюры квартиры'))
    body+=text('Как рассчитывается стоимость','Стоимость зависит от размера, сложности планировки и количества деталей. Рассчитывается индивидуально.')
    body+=text('Как заказать миниатюру','Отправьте материалы, обсудите детали, получите расчёт и согласуйте дальнейшие шаги.',cta('Узнать стоимость миниатюры',VK))+faq('Частые вопросы о миниатюрах',home_faq)
    setpage('miniatura-doma/','3D-миниатюра вашей квартиры или дома',body,'3D-миниатюры квартир и домов: планировка, мебель и детали, 3D-печать, необходимые материалы и индивидуальный расчёт.')
    picker=heading('Кому вы выбираете подарок?','Ответьте на два вопроса, и мы покажем подходящий вариант.')+f'''<section class="gift-picker mp-section" data-gift-picker aria-label="Подбор подарка"><div class="gift-questions"><fieldset><legend>Для кого подарок?</legend><div class="picker-options">{''.join(f'<label><input type="radio" name="recipient" value="{v}" {"checked" if i==0 else ""}><span>{t}</span></label>' for i,(v,t) in enumerate([('partner','Любимому человеку'),('friend','Другу или подруге'),('parents','Родителям'),('other','Другому близкому')]))}</div></fieldset><fieldset><legend>По какому поводу?</legend><div class="picker-options">{''.join(f'<label><input type="radio" name="occasion" value="{v}" {"checked" if i==0 else ""}><span>{t}</span></label>' for i,(v,t) in enumerate([('date','Годовщина / важная дата'),('birthday','День рождения'),('wedding','Свадьба'),('home','Новоселье'),('any','Просто так')]))}</div></fieldset></div><article class="gift-result"><figure><img data-gift-image src="{B}editorial/images/couple-960.webp" width="1122" height="1402" alt="Визуализация рамки для пары"></figure><p class="media-type">Вариант оформления · визуализация</p><div aria-live="polite" aria-atomic="true"><h2 data-gift-title>Рамка для пары</h2><p data-gift-copy>Два узнаваемых образа и ваша памятная дата.</p><p data-gift-price>{PRICE}</p></div><a class="mp-button" data-gift-link href="{B}ramki-s-minifigurkami/">Посмотреть подарок</a><a class="mp-link" data-gift-alternative href="{B}miniatura-doma/">Посмотреть другой вариант: миниатюра дома</a></article></section>'''
    def directory(items):return '<ul class="gift-directory">'+''.join(f'<li>{link("podarki/"+p+"/",t)}</li>' for p,t,*_ in items)+'</ul>'
    picker+=text('Подарки по получателю','Выберите, кому готовите подарок.',directory(ns['gifts'][:6]))+text('Подарки по поводу','Посмотрите подходящие примеры оформления.',directory(ns['gifts'][6:]))
    picker+='<section class="mp-section"><h2>Примеры подарков</h2>'+cards(examples[:2])+'</section>'
    setpage('podarki/','Кому вы выбираете подарок?',picker,'Подберите персональный подарок по получателю и поводу: рамку с минифигурками или 3D-миниатюру дома.',title='Идеи персональных подарков для близких | MIGLIK')
    h1s=['Персональный подарок девушке','Необычный подарок парню','Подарок мужу по вашим фотографиям','Персональный подарок жене','Подарок подруге с вашими фигурками','Персональный подарок родителям','Персональный подарок на годовщину','Подарок на свадьбу с фигурками молодожёнов','Необычный подарок на день рождения','3D-миниатюра квартиры в подарок на новоселье','Подарок на 14 февраля по вашим фотографиям']
    for i,(slug,name,im,sub,copy,kind) in enumerate(ns['gifts']):
        house=slug=='na-novosele'; photo='editorial/images/occasions/'+im+'-800.webp'
        body=hero(h1s[i],copy.split('. ')[0]+'.',photo,'Визуализация: '+name,button('miniatura-doma/' if house else 'ramki-s-minifigurkami/','Подробнее о миниатюре' if house else 'Посмотреть рамки'))
        body+=text('Что можно добавить','Планировку и характерные детали интерьера обсуждаем индивидуально.' if house else ('Общие фотографии и детали поездок; образы двух подруг.' if kind=='friends' else 'Узнаваемые образы, фотографию, надпись и памятную дату. Индивидуальный декор обсудите при заказе.'))
        body+=text('Стоимость и заказ','Индивидуальный расчёт по планировке и фотографиям.' if house else PRICE,button('kak-zakazat/','Как оформить заказ'))
        if slug in ['dlya-roditeley','na-godovshchinu']: body+=text('Другой вариант — миниатюра дома','Можно воспроизвести квартиру или дом по вашим материалам.',button('miniatura-doma/','Посмотреть миниатюры'))
        # Preserve URLs; defer indexation of similar pages without distinct supporting examples.
        pages['podarki/'+slug+'/'].update(title=h1s[i]+' | MIGLIK',desc=copy[:155],body=body,index=slug not in ['dlya-muzha','dlya-zheny','na-den-rozhdeniya','na-14-fevralya'])
    body=heading('Примеры подарков','Рамки с минифигурками и миниатюры домов.')+'<section class="mp-section examples-section"><h2 class="mp-visually-hidden">Галерея оформления</h2><div class="example-filters" role="group" aria-label="Фильтр примеров"><button type="button" data-example-filter="all" aria-pressed="true">Все примеры</button><button type="button" data-example-filter="frame" aria-pressed="false">Рамки с фигурками</button><button type="button" data-example-filter="home" aria-pressed="false">Миниатюры дома</button></div><p class="example-note">Варианты оформления · визуализации</p><div class="mp-cards example-gallery">'
    for _,title,copy,img in examples:
        body+=f'<article class="mp-card example-card" data-example-kind="frame"><figure class="example-media">{image(img,"Визуализация: "+title)}</figure><div class="example-copy"><h3>{title}</h3><p>{copy}</p>{cta("Создать похожую рамку")}</div></article>'
    body+=f'<article class="mp-card example-card" data-example-kind="home"><figure class="example-media">{image("editorial/apartment/key-60.webp","Визуализация миниатюры квартиры")}</figure><div class="example-copy"><h3>Миниатюра квартиры</h3><p>Планировка и интерьер в объёмной рамке.</p>{cta("Обсудить миниатюру",VK)}</div></article></div></section>'
    setpage('primery/','Примеры рамок и 3D-миниатюр',body,'Примеры оформления рамок для пары, подруг и свадьбы, визуализация миниатюры квартиры. Выбор по продукту.')
    reviews=section('reviews');reviews=re.sub(r'<div class="section-heading">[\s\S]*?</div>','<h2>Отзывы с фотографиями</h2>',reviews,count=1)
    setpage('otzyvy/','Отзывы покупателей MIGLIK',heading('Отзывы покупателей MIGLIK')+reviews,'Отзывы покупателей MIGLIK с фотографиями рамок. Тексты и фотографии из материалов, предоставленных владельцем.')
    body=heading('Как заказать рамку или миниатюру')+text('Рамка с минифигурками','Настройте оформление в конструкторе; детали заказа передаются ВКонтакте.',steps([('Размер','Выберите рамку.'),('Персонажи','Соберите фигурки и оформление.'),('Проверка','Проверьте результат и итоговую цену.'),('Передача заказа','Сохраните оформление и передайте детали ВКонтакте.')],key='frame-order')+cta('Открыть конструктор'))
    body+=text('3D-миниатюра дома','Проект и стоимость обсуждаются индивидуально.',steps([('Материалы','Пришлите планировку и фотографии.'),('Детали','Расскажите, что важно повторить.'),('Стоимость','Получите индивидуальный расчёт.'),('Проект','Согласуйте дальнейшие шаги.')],key='home-order')+cta('Написать о миниатюре',VK))
    setpage('kak-zakazat/','Как заказать рамку или миниатюру',body,'Как создать рамку в конструкторе и передать детали ВКонтакте, какие материалы нужны для 3D-миниатюры дома.')
    body=heading('Цены на рамки и 3D-миниатюры')+text('Рамки с минифигурками — от 2 490 ₽','Выберите размер M, L или XL. Итоговая стоимость зависит от комплектации.',size_selector()+cta('Открыть конструктор'))+text('3D-миниатюры дома — индивидуальный расчёт','Стоимость зависит от планировки, размера и детализации.',cta('Узнать стоимость',VK))
    setpage('tseny/','Цены на рамки и 3D-миниатюры',body,'Рамки с минифигурками от 2 490 ₽, размеры M/L/XL. Стоимость 3D-миниатюры дома рассчитывается индивидуально.')
    categories=[('Фигурки и рамки',frame_faq[2:3]),('Размеры и цена',frame_faq[:2]),('Миниатюры дома',home_faq),('Заказ',frame_faq[3:]),('Доставка и оплата',[('Как узнать сроки и условия?','Уточните срок изготовления, оплату и способ получения у MIGLIK до подтверждения заказа.')])]
    setpage('faq/','Частые вопросы',heading('Частые вопросы')+''.join(faq(t,qs,contact=i==0) for i,(t,qs) in enumerate(categories)),'Ответы о фигурках, размерах M/L/XL, стоимости от 2 490 ₽, миниатюрах дома и передаче заказа.')
    setpage('dostavka-i-oplata/','Доставка и оплата',heading('Доставка и оплата')+''.join(text(t,c) for t,c in [('Сроки изготовления','Уточняются для конкретного проекта до заказа.'),('Способы получения','Доступный способ и стоимость получения согласуйте с MIGLIK.'),('Оплата','Порядок и способ оплаты уточняйте в переписке. Демо-магазин не принимает платежи.'),('Что делать при повреждении','Напишите MIGLIK и приложите фотографии, чтобы обсудить ситуацию.')])+cta('Уточнить условия',VK),'Уточните сроки изготовления, получение и оплату персонального подарка MIGLIK. Условия согласуются до заказа.')
    setpage('o-miglik/','О MIGLIK',hero('О MIGLIK','Создаём рамки с персональными минифигурками и 3D-миниатюры квартир и домов.','editorial/images/process/review-frame-800.webp','Визуализация персональной рамки MIGLIK',button('primery/','Посмотреть примеры'))+text('Как мы работаем','Для рамки вы выбираете образы и оформление. Для миниатюры дома присылаете планировку и фотографии; по ним создаём модель для 3D-печати.',cta('Написать нам',VK)),'MIGLIK: персональные рамки с минифигурками и 3D-печатные миниатюры домов. Продукты, процесс и связь с брендом.')
    setpage('kontakty/','Как связаться с MIGLIK',heading('Как связаться с MIGLIK','Напишите ВКонтакте, чтобы обсудить рамку, миниатюру дома или детали заказа.')+text('Что прислать','Для рамки — пожелания по оформлению. Для дома — планировку и фотографии комнат.',cta('Написать ВКонтакте',VK)),'Связаться с MIGLIK ВКонтакте: обсудить рамку с фигурками, миниатюру дома и условия заказа.')
    for path in ['constructor/','cart/','checkout/','account/','account/orders/','account/saved/']:
        p=pages[path];name={'constructor/':'Открыть конструктор','cart/':'Открыть демо-корзину','checkout/':'Проверить демо-корзину','account/':'Открыть демо-кабинет','account/orders/':'Открыть демо-кабинет','account/saved/':'Открыть сохранённые рамки'}[path]
        p['body']=p['body'].replace('Открыть существующее приложение MIGLIK. Вход и оформление доступны только в объёме действующей интеграции.','Демонстрационный магазин не принимает реальные заказы и оплату. Конструктор сохраняет оформление на вашем устройстве.').replace('>Продолжить<','>'+name+'<')

def rewrite_home(home,ns):
    image=ns['image']; cards=ns['cards']; section=ns['section']; text=ns['textsection']; steps=ns['step_cards'];button=ns['button']
    home=re.sub(r'<h1>[\s\S]*?</h1>','<h1>Персональные рамки с минифигурками и <span class="highlight">3D-миниатюры домов<i aria-hidden="true"></i></span></h1>',home,count=1)
    home=home.replace('Рамки с минифигурками по фото и миниатюры дома. Сохраняем людей, моменты и места, которые вам дороги.','Создаём рамки с фигурками по вашим фотографиям и объёмные миниатюры квартир и домов.')
    home=re.sub(r'<div class="hero-actions">[\s\S]*?</div>',f'<div class="hero-actions"><a class="button" href="{B}ramki-s-minifigurkami/">Посмотреть рамки</a><a class="hero-secondary" href="{B}miniatura-doma/">Миниатюры дома</a></div><a class="skip-story" href="#products">Пропустить анимацию</a>',home,count=1)
    # Preserve scene structure and visual elements required by the existing GSAP runtime.
    replacements={'Похожие даже в <em>мелочах.</em>':'Как выглядит <em>готовая рамка</em>','Для особенного <em>момента.</em>':'Как упакован <em>подарок</em>','Подарок, в котором всё <em>про вас</em>':'Упаковка с <em>бордовой лентой</em>','С любовью.<br>Для ваших <em>близких</em>':'Создайте свою <em>рамку</em>','Причёска, очки, любимый свитшот Ваша история — внутри настоящей объёмной рамки':'Минифигурки и оформление — в объёмной рамке.','Ваша рамка занимает своё место в подарочной коробке':'Рамка помещается в подарочную коробку.','Бордовая лента, красивый бант и самые тёплые слова.':'Вариант оформления подарочной коробки.','История подарка может быть разной Главное — чтобы она была только вашей':'Выберите образы, размер и оформление.','А вот, что делает':'Как создать фигурки,','историю <span class="highlight">вашей':'похожие <span class="highlight">на вас','Не просто вещи. Воспоминания.':'','Любимая фотография, дата знакомства, общая песня или вещь, над которой смеётесь только вы.':'Выберите лицо, причёску, одежду и аксессуары из доступных вариантов.','— Любимая фотография.':'— Лицо и оттенок кожи.','— Ваша песня.':'— Причёска и цвет волос.','— Тот самый день.':'— Одежда.','— Ваши маленькие детали.':'— Аксессуары.'}
    for a,b in replacements.items():home=home.replace(a,b)
    product_html='<section class="mp-section mp-directions" id="products"><h2>Какие подарки мы создаём</h2>'+cards([('ramki-s-minifigurkami/','Рамки с минифигурками','Выберите фигурки, их одежду и оформление. От 2 490 ₽; итог зависит от комплектации.','editorial/images/couple-960.webp'),('miniatura-doma/','3D-миниатюры квартир и домов','Воссоздаём планировку и детали интерьера. Индивидуальный расчёт.','editorial/apartment/key-60.webp')])+'</section>'
    home=re.sub(r'<section\b[^>]*id="products"[\s\S]*?</section>',product_html,home,count=1)
    gallery='<section class="gallery-section editorial-section" id="stories" aria-labelledby="stories-heading"><h2 id="stories-heading">Примеры готовых работ</h2><p>Варианты оформления · визуализации.</p>'+cards([('primery/','Для пары','Два героя, дата и музыкальное оформление.','editorial/images/couple-960.webp'),('primery/','Для подруг','Фотография и детали совместных поездок.','editorial/images/friends-960.webp'),('primery/','На свадьбу','Образы молодожёнов и памятная фотография.','editorial/images/wedding-960.webp')])+'</section>'
    home=re.sub(r'<section\b[^>]*id="stories"[\s\S]*?</section>',gallery,home,count=1)
    # Migrate lengthy occasion/review sections to their existing standalone pages.
    for ident in ['occasions','reviews']:
        home=re.sub(r'<section\b[^>]*id="'+ident+r'"[\s\S]*?</section>','',home,count=1)
    home=home.replace('Место, где началась','3D-миниатюра вашей').replace('ваша <span class="highlight">история','квартиры <span class="highlight">или дома')
    home=home.replace('Первая квартира, любимый дом или место, где вы были счастливы.','Воспроизводим планировку, мебель и детали по вашим материалам.')
    home=re.sub(r'(<section\b[^>]*id="apartment"[\s\S]*?)<a class="text-link"[\s\S]*?</a>',lambda m:m[1]+f'<a class="text-link" href="{B}miniatura-doma/">Подробнее о миниатюрах</a>',home,count=1)
    process='<section class="process-section editorial-section" id="process"><h2>Как создать рамку</h2>'+steps([('Размер','Выберите рамку.'),('Фигурки','Соберите образы.'),('Оформление','Добавьте фото и надпись.'),('Стоимость','Проверьте результат и расчёт.')],key='home-frame-process')+f'<a class="text-link" href="{STUDIO}">Открыть конструктор</a></section>'
    # Keep .process-list for the existing animation selector, without changing runtime logic.
    process=process.replace('class="mp-step-list"','class="mp-step-list process-list"')
    home=re.sub(r'<section\b[^>]*id="process"[\s\S]*?</section>',process,home,count=1)
    price='<section class="mp-directions mp-section"><h2>Сколько стоит рамка</h2><p>'+PRICE+'</p>'+button('tseny/','Посмотреть размеры и цены')+'</section>'
    home=home.replace('<section class="process-section',price+'<section class="process-section',1)
    faq=ns['faq']([
        ('Сколько стоит рамка?', PRICE),
        ('Можно изменить фигурки?', 'Да. Выбирайте лица, причёски, одежду и аксессуары в конструкторе.'),
        ('Как заказать миниатюру дома?', 'Пришлите планировку и фотографии MIGLIK ВКонтакте для индивидуального расчёта.'),
    ], home=True)
    home=re.sub(r'<section\b[^>]*id="faq"[\s\S]*?</section>',faq,home,count=1)
    home=home.replace('Теперь <span class="highlight">ваша<i aria-hidden="true"></i></span> очередь','Создайте свою рамку').replace('Теперь ваша очередь','Создайте свою рамку')
    home=home.replace('Начать можно с одной фотографии и пары слов о человеке, для которого вы готовите подарок.','Выберите образы и оформление в конструкторе.')
    home=home.replace('>Задать вопрос <span aria-hidden="true">↗</span></a>','>Обсудить миниатюру дома</a>')
    home=re.sub(r'<title>.*?</title>','<title>MIGLIK — рамки с минифигурками и 3D-миниатюры по фото</title>',home,count=1)
    for prop,val in [('description','Создаём рамки с минифигурками от 2 490 ₽ и 3D-миниатюры квартир и домов по вашим материалам. Выберите продукт и узнайте, как оформить заказ.')]:home=re.sub(r'<meta name="'+prop+r'" content="[^"]*">',f'<meta name="{prop}" content="{val}">',home,count=1)
    home=re.sub(r'<h2 id="final-heading"[^>]*>[\s\S]*?</h2>','<h2 id="final-heading">Создайте свою рамку</h2>',home,count=1)
    home=home.replace('aria-labelledby="final-heading"','aria-labelledby="final-heading"')
    home=re.sub(r'(<section[^>]*id="your-story"[\s\S]*?)Создать подарок',r'\1Создать рамку',home,count=1)
    home=re.sub(r'<ol class="memory-words"[\s\S]*?</ol>','<ol class="memory-words" aria-label="Настройки фигурок"><li>Лицо и оттенок кожи.</li><li>Причёска и цвет волос.</li><li>Одежда.</li><li>Аксессуары.</li></ol>',home,count=1)
    home=re.sub(r'<meta property="og:title" content="[^"]*">','<meta property="og:title" content="MIGLIK — рамки с минифигурками и 3D-миниатюры домов">',home)
    home=re.sub(r'<meta property="og:description" content="[^"]*">','<meta property="og:description" content="Рамки от 2 490 ₽ и 3D-миниатюры домов с индивидуальным расчётом. Выберите продукт и узнайте, как заказать.">',home)
    schema='{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://alinageminivolsip-ai.github.io/Mini-Brick-Studio/miglik/#brand","name":"MIGLIK","url":"https://alinageminivolsip-ai.github.io/Mini-Brick-Studio/miglik/"},{"@type":"WebSite","name":"MIGLIK","url":"https://alinageminivolsip-ai.github.io/Mini-Brick-Studio/miglik/","inLanguage":"ru-RU"}]}'
    home=home.replace('</head>','<script type="application/ld+json">'+schema+'</script></head>')
    return home
