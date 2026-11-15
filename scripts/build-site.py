#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build crawlable pages around the existing MIGLIK applications. No third-party packages."""
from pathlib import Path
import re,json,html,hashlib,subprocess
from functools import lru_cache
R=Path(__file__).resolve().parent.parent
M=R/'miglik'
B='/Mini-Brick-Studio/miglik/'
ORIGIN='https://alinageminivolsip-ai.github.io'
STUDIO='/Mini-Brick-Studio/studio/'
VK='https://vk.com/write-224539480'
source=(R/'site-src/home.html').read_text()
def esc(s): return html.escape(s,quote=True)
def link(path,label,cls=''): return f'<a class="{cls}" href="{B+path}">{label}</a>'
def button(path,label): return link(path,label,'mp-button')
@lru_cache(maxsize=None)
def dimensions(file):
    result=subprocess.check_output(['sips','-g','pixelWidth','-g','pixelHeight',str(M/file)],text=True)
    return re.search(r'pixelWidth: (\d+)',result)[1],re.search(r'pixelHeight: (\d+)',result)[1]
def image(file,alt,lazy=True):
    w,h=dimensions(file)
    small=re.sub(r'-(960|800)\.webp$', '-480.webp',file)
    responsive=''
    if small!=file and (M/small).exists():
        sw,_=dimensions(small)
        responsive=f' srcset="{B+small} {sw}w, {B+file} {w}w" sizes="(max-width: 767px) 90vw, 42vw"'
    return f'<img src="{B+file}"{responsive} alt="{esc(alt)}" width="{w}" height="{h}" loading="{"lazy" if lazy else "eager"}" decoding="async">'
def section(id):
    match=re.search(r'<section\b[^>]*\bid="'+id+r'"[\s\S]*?</section>',source)
    if not match: raise ValueError(id)
    return match[0]
nav=[('ramki-s-minifigurkami/','Рамки'),('miniatura-doma/','Миниатюры дома'),('podarki/','Идеи подарков'),('primery/','Наши работы'),('kak-zakazat/','Как заказать')]
def header():
    links=''.join(link(p,t) for p,t in nav)
    return f'''<header class="mp-header"><div class="mp-header-inner"><a class="mp-logo" href="{B}" aria-label="MIGLIK — главная">MIGLIK<span>.</span></a><nav class="mp-desktop" aria-label="Основная навигация">{links}</nav><a class="mp-button mp-create" href="{STUDIO}">Создать рамку</a><button class="mp-menu-toggle" type="button" aria-expanded="false" aria-controls="mp-menu">Меню</button></div><dialog id="mp-menu" aria-label="Меню сайта"><div class="mp-menu-top"><span class="mp-logo">MIGLIK<span>.</span></span><button type="button" data-close-menu>Закрыть</button></div><nav aria-label="Разделы сайта">{links}<details><summary>Для кого и по какому поводу</summary>{''.join(link('podarki/'+p+'/',t) for p,t,*_ in gifts)}</details>{link('tseny/','Стоимость')}{link('otzyvy/','Отзывы')}{link('faq/','Вопросы')}{link('cart/','Корзина')}{link('account/','Кабинет')}</nav></dialog></header>'''
def footer():
    return f'''<footer class="mp-footer"><div><a class="mp-logo" href="{B}">MIGLIK<span>.</span></a><p>Маленький мир вашей большой истории.</p><a href="{VK}">Написать ВКонтакте</a></div><nav aria-label="Полезное">{''.join(link(p,t) for p,t in nav)}{link('tseny/','Стоимость')}{link('otzyvy/','Отзывы')}{link('dostavka-i-oplata/','Доставка и оплата')}{link('faq/','Вопросы')}{link('o-miglik/','О MIGLIK')}{link('kontakty/','Контакты')}</nav><nav aria-label="Покупателям">{link('cart/','Корзина')}{link('account/','Кабинет')}{link('privacy/','Конфиденциальность')}{link('personal-data-consent/','Согласие на обработку данных')}{link('offer/','Оферта')}{link('terms/','Условия')}{link('cookies/','Cookie')}{link('vozvrat/','Возврат')}</nav><p class="mp-demo">Демонстрационная версия магазина. Реальные заказы пока не принимаются.</p></footer>'''
def hero(title,text,file,alt,action=None):
    return f'<section class="mp-hero"><div><h1>{title}</h1><p class="mp-lead">{text}</p><div class="mp-actions">{action or button("ramki-s-minifigurkami/","Выбрать рамку")}</div></div><figure>{image(file,alt,False)}</figure></section>'
def textsection(title,text,extra=''):
    return f'<section class="mp-section mp-copy"><h2>{title}</h2><p>{text}</p>{extra}</section>'
def faq(items):
    return '<section class="mp-section mp-copy"><h2>Частые вопросы</h2>'+''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q,a in items)+'</section>'
def cards(items):
    return '<div class="mp-cards">'+''.join(f'<a class="mp-card" href="{B+p}"><figure>{image(f,t)}</figure><h3>{t}</h3><p>{d}</p><span class="mp-card-action">Подробнее</span></a>' for p,t,d,f in items)+'</div>'
def step_cards(items,label='Этапы',key='steps'):
    track=key+'-track'
    entries=''
    for i,item in enumerate(items):
        title,copy,*media=item
        picture=('<figure class="mp-step-picture">'+image(media[0],title)+'</figure>') if media else ''
        entries+=f'<li class="mp-step-card"><span class="mp-step-number" aria-hidden="true">{i+1:02}</span>{picture}<h3>{title}</h3><p>{copy}</p></li>'
    return f'<ol class="mp-step-list" id="{track}" data-step-track data-step-label="{label}" style="--step-count:{len(items)}">{entries}</ol><div class="mp-step-controls" data-step-controls="{track}" hidden><span>Листайте карточки</span><div class="process-pagination"><button type="button" data-process-prev aria-label="Предыдущий этап" aria-controls="{track}">←</button><output aria-live="polite"></output><button type="button" data-process-next aria-label="Следующий этап" aria-controls="{track}">→</button></div></div>'
gifts=[
('dlya-devushki','Подарок девушке','surprise','Вспомните момент, который хочется повторить','Сохраните вашу встречу, совместную поездку или любимую фотографию. Важна деталь, по которой она сразу узнает вашу историю.','couple'),
('dlya-parnya','Подарок парню','love','Его привычный образ — в маленьком масштабе','Любимая толстовка, очки и общая песня помогут сделать подарок узнаваемым. Начните с образа, который вам особенно близок.','couple'),
('dlya-muzha','Подарок мужу','anniversary','Ваши общие истории заслуживают своей рамки','Выберите эпизод из вашей жизни: первую встречу, путешествие или вечер дома. Дата и небольшая надпись помогут сохранить именно этот момент.','couple'),
('dlya-zheny','Подарок жене','anniversary','Вспомнить, с чего всё началось','Первая фотография вместе или дата, которую помните только вы двое. Соберите героев и добавьте слова, которые хочется сказать лично.','couple'),
('dlya-podrugi','Подарок подруге','friends','Про то, над чем смеётесь только вы','Общая поездка, любимая песня или фотография из вашего архива. Пусть в рамке останутся маленькие детали вашей дружбы.','friends'),
('dlya-roditeley','Подарок родителям','home','Люди и место, с которыми связано детство','Можно начать с семейных образов в рамке или обсудить миниатюру родного дома. Для дома пригодятся планировка и фотографии интерьера.','home'),
('na-godovshchinu','Подарок на годовщину','anniversary','Ваша дата. Ваша история. Снова вместе','Сохраните первый день или событие, к которому хочется возвращаться. Подберите два узнаваемых образа и памятную надпись.','couple'),
('na-svadbu','Подарок на свадьбу','wedding','Тот самый день — в маленьких деталях','Свадебные образы, фотография пары и дата могут стать основой композиции. Индивидуальное оформление обсудите перед заказом.','wedding'),
('na-den-rozhdeniya','Подарок на день рождения','surprise','Начните с человека, которому дарите','Вспомните его привычный образ, увлечения и общие моменты. В конструкторе можно подобрать одежду и аксессуары из доступного каталога.','friends'),
('na-novosele','Подарок на новоселье','home','Первый вечер в новом доме','Миниатюра планировки поможет сохранить место, где начинается новая история. Подготовьте план и фотографии комнат для обсуждения проекта.','home'),
('na-14-fevralya','Подарок на 14 февраля','love','О любви своими словами','Выберите общую фотографию и важную для вас дату. Начните с двух героев, а особенности оформления уточните в переписке.','couple')]
products=[('ramki-s-minifigurkami/','Рамки с минифигурками','Маленькие версии вас, фотографии и личные детали.','editorial/images/couple-960.webp'),('miniatura-doma/','Ваш дом в миниатюре','Любимое место — от планировки до рамки.','editorial/apartment/key-60.webp')]
commonfaq=[('Можно изменить персонажей?','Да. В существующем конструкторе доступны причёски, лица, одежда и аксессуары. Выбор виден в предпросмотре.'),('Как узнать стоимость?','Расчёт доступен в конструкторе. Цены демонстрационного магазина тестовые; условия реального заказа нужно подтвердить у MIGLIK.'),('Можно собрать несколько рамок?','В конструкторе можно сохранить несколько рамок, отредактировать или продублировать сохранённую композицию.')]
pages={}
def add(path,title,desc,body,group=None,index=True): pages[path]=dict(title=title,desc=desc,body=body,group=group,index=index)
framebody=hero('Рамка с минифигурками <em>по вашим фото</em>','Причёска, одежда, любимая песня и дата. Маленькая история, в которой узнаёте себя.','editorial/images/couple-960.webp','Объёмная белая рамка с двумя минифигурками',f'<a class="mp-button" href="{STUDIO}">Создать свою рамку</a>'+link('primery/','Посмотреть примеры','mp-link'))
framebody+=textsection('Похожие даже в мелочах','Соберите образы из существующего каталога. Настройки сразу отображаются в предпросмотре рамки.',step_cards([('Причёска и внешность','Лицо, оттенок кожи, причёска и цвет волос.'),('Одежда и образы','Выберите подходящую одежду и соберите привычный образ.'),('Очки и аксессуары','Добавьте узнаваемые детали из доступного каталога.')],label='Детали персонажей',key='character-details'))
framebody+=textsection('Что можно добавить в рамку','Фотографию, памятную дату, надпись и декоративные детали. Музыку и индивидуальную композицию уточните перед заказом.',image('editorial/images/process/personal-details-800.webp','Личные детали: билет, кофе и памятная записка'))
framebody+=f'<section class="mp-section"><h2>Выберите вашу историю</h2>'+cards([('podarki/na-godovshchinu/','Для двоих','Ваша дата и общие воспоминания.','editorial/images/couple-960.webp'),('podarki/dlya-podrugi/','Для друзей','Детали, которые понятны только вам.','editorial/images/friends-960.webp'),('podarki/na-svadbu/','Свадьба','Маленькая история большого дня.','editorial/images/wedding-960.webp')])+'</section>'
framebody+=textsection('Стоимость и комплектация','Стоимость зависит от выбранной рамки и деталей. Посмотрите расчёт в конструкторе и подтвердите условия перед оформлением.',button('tseny/','Как рассчитывается цена'))+faq(commonfaq)
add('ramki-s-minifigurkami/','Рамка с минифигурками по фото на заказ | MIGLIK','Персональная рамка с минифигурками: одежда, причёски, аксессуары, фото и памятная надпись. Примеры и существующий конструктор MIGLIK.',framebody)
apartment=section('apartment').replace('id="apartment-heading"','id="apartment-heading"')
homebody=hero('Ваш дом <em>в миниатюре</em>','Создаём объёмную миниатюру на 3D-принтере по вашей планировке. Сохраняем комнаты и детали места, которое вам дорого.','editorial/apartment/key-60.webp','Миниатюра квартиры в белой рамке',f'<a class="mp-button" href="{VK}">Обсудить мою миниатюру</a>')
homebody+=apartment
homebody+=textsection('От планировки до 3D-печатной миниатюры','Мы создаём объёмные модели на 3D-принтере по вашей планировке. Сначала переводим пространство в цифровую модель, затем печатаем детали и собираем миниатюру.',step_cards([
('Вы присылаете планировку','Пришлите план квартиры или дома с известными размерами. Фотографии комнат помогут передать особенности интерьера.','editorial/apartment/key-0.webp'),
('Создаём 3D-модель','По планировке выстраиваем объёмную цифровую модель: расположение комнат, стен и основных элементов пространства.','editorial/apartment/key-14.webp'),
('Печатаем на 3D-принтере','Подготавливаем цифровую модель к 3D-печати и печатаем физические детали будущей миниатюры.','editorial/apartment/key-40.webp'),
('Собираем миниатюру','Объединяем напечатанные детали в объёмную композицию и оформляем её в рамку. Особенные детали вашего дома обсуждаем отдельно.','editorial/apartment/key-60.webp'),
('Готовим к передаче','Обсуждаем готовую композицию, упаковку и удобный способ получения. Стоимость и сроки согласовываем для вашего проекта.','editorial/images/process/gift-box-800.webp')
],label='Пять этапов создания миниатюры дома',key='home-creation'))
homebody+=textsection('Что понадобится от вас','Чем понятнее исходные материалы, тем точнее можно обсудить будущую миниатюру.',step_cards([('Планировка и размеры','План помещения и известные размеры комнат. Если каких-то данных нет, напишите об этом при обращении.'),('Фотографии интерьера','Общие виды комнат и крупные снимки деталей, которые важно сохранить.'),('Ваши пожелания','Расскажите, какое место воспроизводим и что делает его особенным для вас.')],label='Материалы для миниатюры',key='home-materials'))
homebody+=textsection('От чего зависит стоимость','Проект обсуждается индивидуально. До подтверждения состава работ фиксированная цена и срок не заявлены.',button('kontakty/','Обсудить проект'))
homebody+=faq([('Это фотография готового заказа?','На странице показана существующая визуализация направления «Дом». Реализацию и детали вашего проекта обсудите отдельно.'),('Подойдёт в подарок на новоселье?','Можно обсудить миниатюру нового дома. Понадобятся планировка, фотографии и пожелания.')])
add('miniatura-doma/','3D-миниатюра квартиры и дома по планировке | MIGLIK','Ваш дом в миниатюре: существующая визуализация от чертежа до рамки, необходимые материалы и обсуждение индивидуального проекта.',homebody)
add('podarki/','Идеи персональных подарков | MIGLIK','Выберите подарок по человеку и событию: рамки с минифигурками или миниатюра дома. Авторские композиции MIGLIK.',hero('Для тех, кто <em>значит больше</em>','Сначала выберите человека или повод. Затем — детали, которые сделают историю вашей.','editorial/images/occasions/surprise-800.webp','Девушка открывает подарок MIGLIK',button('ramki-s-minifigurkami/','Посмотреть рамки'))+'<section class="mp-section"><h2>Для кого и по какому поводу</h2>'+cards([('podarki/'+p+'/',t,sub,'editorial/images/occasions/'+im+'-800.webp') for p,t,im,sub,_,_ in gifts])+'</section>')
for p,t,im,sub,copy,kind in gifts:
    target='miniatura-doma/' if kind=='home' else 'ramki-s-minifigurkami/'
    photo='editorial/images/'+('couple' if kind=='home' else kind)+'-960.webp'
    body=hero(t.replace('Подарок ','Подарок <em>',1)+'</em>',sub,'editorial/images/occasions/'+im+'-800.webp',t,button(target,'Обсудить миниатюру' if kind=='home' else 'Создать свою историю'))
    body+=textsection(sub,copy)+f'<section class="mp-section"><h2>С чего начать</h2>'+cards(products if kind=='home' else [(target,'Рамка с вашими героями','Подберите одежду, причёску и личные детали.',photo)])+'</section>'
    body+=textsection('Детали, по которым узнают вашу историю',copy,button('kak-zakazat/','Как подготовиться к заказу'))+textsection('Стоимость и оформление','Расчёт рамки доступен в конструкторе. Миниатюра дома обсуждается индивидуально. Реальные условия и стоимость подтверждаются перед заказом.',button('tseny/','Узнать о стоимости'))+faq(commonfaq[:2])
    add('podarki/'+p+'/',t+' по вашей истории | MIGLIK',sub+'. '+copy[:100],body,'Подарки')
add('primery/','Примеры персональных рамок и миниатюр | MIGLIK','Авторские композиции MIGLIK: рамка для пары, подруг, свадебная история и визуализация миниатюры дома.','<section class="mp-page-title"><h1>Истории, которые <em>можно подарить</em></h1><p class="mp-lead">Примеры оформления. Вашу композицию можно собрать по-своему.</p></section>'+section('stories')+textsection('Место тоже хранит воспоминания','Посмотрите, как план квартиры превращается в миниатюру.',button('miniatura-doma/','Посмотреть миниатюру дома')))
add('otzyvy/','Отзывы о персональных подарках MIGLIK','Три отзыва покупателей с фотографиями рамок: Анна, Анастасия и Игорь. Оригинальные тексты из предоставленного макета.','<section class="mp-page-title"><h1>Подарки, которые <em>стали личными</em></h1></section>'+section('reviews'))
add('kak-zakazat/','Как заказать персональный подарок | MIGLIK','Пять шагов: выбрать историю, подготовить фотографии, рассказать о деталях, проверить рамку и обсудить оформление.','<section class="mp-page-title"><h1>От идеи <em>до подарка</em></h1><p class="mp-lead">Для рамки начните с героев. Для миниатюры дома — с планировки.</p></section>'+section('process')+textsection('Два разных пути к личному подарку','Рамку можно собрать в конструкторе. Для дома пришлите планировку: по ней создаём цифровую 3D-модель, печатаем детали на 3D-принтере и собираем миниатюру.',cards(products)))
add('tseny/','Стоимость персональных рамок и миниатюр | MIGLIK','Что влияет на стоимость рамки с минифигурками и миниатюры дома. Расчёт в конструкторе и индивидуальное обсуждение.',hero('Сколько стоит <em>ваша история</em>','Для рамки стоимость зависит от конфигурации. Для миниатюры дома — от согласованного проекта.','editorial/images/process/review-frame-800.webp','Персональная рамка с минифигурками',f'<a class="mp-button" href="{STUDIO}">Рассчитать рамку</a>')+textsection('Рамки с минифигурками','Выберите размер, цвет и детали в существующем конструкторе. Стоимость демонстрационного магазина тестовая; не является подтверждённым коммерческим предложением.',button('shop/?view=%2Fcatalog','Посмотреть тестовый каталог'))+textsection('Миниатюры дома','Состав проекта и цену нужно обсудить отдельно. Подготовьте планировку, фотографии и пожелания.',f'<a class="mp-button" href="{VK}">Обсудить миниатюру</a>'))
add('faq/','Вопросы о подарках и заказе | MIGLIK','Ответы о выборе минифигурок, фотографиях, оформлении рамки, нескольких подарках, стоимости и обсуждении заказа.','<section class="mp-page-title"><h1>Остались <em>вопросы?</em></h1></section>'+section('faq'))
add('dostavka-i-oplata/','Доставка и оплата | MIGLIK','Как уточнить доставку, оплату и срок изготовления персонального подарка MIGLIK. Условия подтверждаются для конкретного проекта.',textsection('Доставка и оплата','Доступные способы доставки, стоимость, срок изготовления и порядок оплаты уточняйте у MIGLIK до заказа. На сайте нет подтверждённой информации для обещания конкретных сроков.').replace('<h2>','<h1>',1).replace('</h2>','</h1>',1)+textsection('До оформления','Согласуйте состав подарка, итоговую стоимость и доставку. Демонстрационный магазин не принимает реальные заказы.',f'<a class="mp-button" href="{VK}">Уточнить условия</a>'))
add('o-miglik/','О MIGLIK — подарки из личных историй','MIGLIK сохраняет людей, моменты и места в персональных композициях: рамки с минифигурками и миниатюры дома.',hero('Маленький мир <em>большой истории</em>','Фотография, дата, любимая вещь или место. Из знакомых деталей складывается личный подарок.','editorial/images/occasions/anniversary-800.webp','Пара с персональной рамкой MIGLIK',button('primery/','Посмотреть наши работы'))+textsection('Люди, моменты и места','Рамки сохраняют узнаваемые образы. Миниатюры дома — пространство, с которым связаны воспоминания.',cards(products)))
add('kontakty/','Контакты MIGLIK — обсудить подарок','Связаться с MIGLIK ВКонтакте, обсудить рамку или миниатюру дома, уточнить стоимость и условия заказа.',textsection('Давайте обсудим вашу историю','Напишите MIGLIK ВКонтакте: расскажите, кому готовите подарок и какие детали хотите сохранить.',f'<a class="mp-button" href="{VK}">Написать ВКонтакте</a>').replace('<h2>','<h1>',1).replace('</h2>','</h1>',1)+textsection('Перед оформлением','Реквизиты продавца, условия оплаты и доставки пока не подтверждены. Реальные заказы в демонстрационном магазине не принимаются.'))
# Functional aliases integrate existing apps without creating fake checkout/login implementations.
for path,title,dest in [('constructor/','Конструктор рамки',STUDIO),('cart/','Корзина',B+'shop/?view=%2Fcart'),('checkout/','Проверка заказа',B+'shop/?view=%2Fcart'),('account/','Личный кабинет',B+'shop/?view=%2Faccount'),('account/orders/','Мои заказы',B+'shop/?view=%2Faccount'),('account/saved/','Сохранённые рамки',STUDIO)]:
    add(path,title+' | MIGLIK','Переход в существующее приложение MIGLIK.',f'<section class="mp-page-title"><h1>{title}</h1><p>Открыть существующее приложение MIGLIK. Вход и оформление доступны только в объёме действующей интеграции.</p><a class="mp-button" href="{dest}">Продолжить</a></section>',index=False)
# Existing legal drafts are kept verbatim and stay out of index.
for path,name,old in [('privacy/','Конфиденциальность','privacy.html'),('personal-data-consent/','Согласие на обработку данных','consent-order.html'),('offer/','Оферта','legal.html'),('terms/','Условия','terms.html'),('cookies/','Cookie и память браузера','cookies.html'),('vozvrat/','Возврат','returns.html')]:
    doc=(M/'shop'/old).read_text(); body=re.search(r'<main\b[^>]*>([\s\S]*?)</main>',doc)[1]
    add(path,name+' | MIGLIK','Существующий проект документа MIGLIK для проверки владельцем.',f'<section class="mp-copy mp-section">{body}</section>',index=False)
for path,p in pages.items():
    crumbs=[('','Главная')]+([('podarki/','Подарки')] if p['group'] else [])
    name=re.sub(r'<[^>]+>','',p['title'].split(' | ')[0])
    bread='<nav class="mp-breadcrumbs" aria-label="Хлебные крошки">'+''.join(link(a,b)+'<span aria-hidden="true">/</span>' for a,b in crumbs)+f'<span aria-current="page">{esc(name)}</span></nav>'
    schema={'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':i+1,'name':t,'item':ORIGIN+B+a} for i,(a,t) in enumerate(crumbs+[(path,name)])]}
    body=p['body'].replace('https://alinageminivolsip-ai.github.io/Mini-Brick-Studio/studio/',STUDIO)
    # Examples refer to current integrated constructor and product pages; approved copy stays intact.
    if path in ['otzyvy/','faq/']:
        body=re.sub(r'<div class="section-heading">[\s\S]*?</div>','<h2>Впечатления о подарках</h2>',body,count=1) if path=='otzyvy/' else body.replace('<h2 id="faq-heading" data-reveal>Вопросы, которые могут возникнуть</h2>','<h2 id="faq-heading">Выбор и оформление</h2>')
    document=f'''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>{esc(p['title'])}</title><meta name="description" content="{esc(p['desc'])}"><meta name="robots" content="{'index,follow' if p['index'] else 'noindex,follow'}"><link rel="canonical" href="{ORIGIN+B+path}"><meta property="og:type" content="website"><meta property="og:locale" content="ru_RU"><meta property="og:title" content="{esc(p['title'])}"><meta property="og:description" content="{esc(p['desc'])}"><meta property="og:url" content="{ORIGIN+B+path}"><meta property="og:image" content="{ORIGIN+B}editorial/images/share.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="{B}shop/favicon.svg"><link rel="stylesheet" href="{B}assets/index-DvwcqADe.css"><link rel="stylesheet" href="{B}process-slider.css"><link rel="stylesheet" href="{B}reviews.css"><link rel="stylesheet" href="{B}site/site.css?v=unify-1"><link rel="stylesheet" href="{B}site/typography.css"><script type="module" src="{B}site/site.js?v=unify-1"></script><script type="application/ld+json">{json.dumps(schema,ensure_ascii=False)}</script></head><body class="multipage"><a class="mp-skip" href="#main">К содержимому</a>{header()}<main id="main" tabindex="-1">{bread}{body}<section class="mp-section mp-next"><h2>Сохраните <em>свою историю</em></h2>{button('ramki-s-minifigurkami/','Рамки с минифигурками')}{button('miniatura-doma/','Миниатюры дома')}</section></main>{footer()}</body></html>'''
    out=M/path/'index.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(document)
# Integrate navigation and product discovery on existing homepage, retaining all authored scenes.
home=source.replace('process-slider.js?v=reviews-1','process-slider.js?v=unify-1').replace('<meta name="robots" content="noindex,nofollow">','<meta name="robots" content="index,follow">\n<link rel="canonical" href="'+ORIGIN+B+'">')
home=home.replace('<title>MIGLIK — персональные подарки по вашим фотографиям</title>','<title>MIGLIK — персональные подарки по фото и 3D-миниатюры</title>')
home=home.replace('<script type="module" src="/Mini-Brick-Studio/miglik/shop/homepage-store.js?v=polish-1"></script>','')
home=re.sub(r'<header class="site-header">[\s\S]*?</header>',header(),home,count=1)
home=home.replace('<link rel="stylesheet" href="/Mini-Brick-Studio/miglik/interface.css?v=2">','<link rel="stylesheet" href="/Mini-Brick-Studio/miglik/interface.css?v=2"><link rel="stylesheet" href="'+B+'site/site.css?v=unify-1"><script type="module" src="'+B+'site/site.js?v=unify-1"></script>')
# Keep the animation's .brand hook without intercepting cross-page navigation.
home=home.replace('class="mp-logo" href="'+B+'" aria-label','class="mp-logo brand" href="#start" aria-label',1)
home=home.replace('<section class="memory-section', '<section class="mp-section mp-directions" id="products"><h2>Какую историю вы хотите <em>сохранить?</em></h2>'+cards(products)+'</section>\n<section class="memory-section',1)
home=re.sub(r'<h1>[\s\S]*?</h1>','<h1>Маленький мир<br>вашей большой <span class="highlight">истории<i aria-hidden="true"></i></span></h1>',home,count=1)
home=home.replace('Превращаем ваши фотографии, важные даты и маленькие воспоминания в подарки, которые хочется хранить.','Рамки с минифигурками по фото и миниатюры дома. Сохраняем людей, моменты и места, которые вам дороги.')
home=home.replace('href="#stories">Посмотреть истории','href="'+B+'primery/">Посмотреть примеры')
# Each occasion gets its own crawlable destination.
for text,path in [('Подарок девушке','dlya-devushki'),('Подарок парню','dlya-parnya'),('Подарок подруге','dlya-podrugi'),('На годовщину','na-godovshchinu'),('На свадьбу','na-svadbu'),('На новоселье','na-novosele')]:
    home=re.sub(r'(<a\b[^>]*href=")[^"]+("[^>]*>(?:(?!</a>)[\s\S])*?<strong>'+text+r'</strong>)',lambda m:m[1]+B+'podarki/'+path+'/'+m[2],home,count=1)
home=re.sub(r'<footer class="site-footer"[\s\S]*?</footer>',footer(),home,count=1)
home=home.replace('https://alinageminivolsip-ai.github.io/Mini-Brick-Studio/studio/',STUDIO)
home=home.replace('</head>','<link rel="stylesheet" href="'+B+'site/typography.css"></head>')
(M/'index.html').write_text(home)
urls=['']+[p for p,v in pages.items() if v['index']]
(M/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+ORIGIN+B+p+'</loc></url>' for p in urls)+'</urlset>')
(M/'robots.txt').write_text('User-agent: *\nAllow: /Mini-Brick-Studio/miglik/\nSitemap: '+ORIGIN+B+'sitemap.xml\n# GitHub Pages reads robots.txt only at the origin root; this file documents the project policy.\n')
# Extract the exact existing apartment player, retain algorithm and asset references.
bundle=(M/'assets/index-DOE2Nm44.js').read_text(); start=bundle.index('ee={count:61');end=bundle.index('const G=',start)
(M/'site/apartment-player.js').write_text('// Existing apartment player, extracted unchanged from index-DOE2Nm44.js.\n'+'const '+bundle[start:end]+'\nexport {V as ApartmentPlayer};\n')
manifest={'base':B,'pages':[{'path':p,'title':v['title'],'index':v['index']} for p,v in pages.items()]}
(M/'site/routes.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(f'Built homepage + {len(pages)} static routes; {len(urls)} indexable URLs. Constructor untouched.')
