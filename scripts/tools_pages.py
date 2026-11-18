"""Static entry points for the creative tools."""


def add_tools(add, base):
    path = 'tools/kollazh-iz-foto/'
    add('tools/', 'Бесплатные инструменты для фото и открыток | MIGLIK',
        'Создайте коллаж из фотографий бесплатно и используйте его в рамке MIGLIK.',
        f'''<section class="mp-page-title"><h1>Бесплатные инструменты для ваших фотографий</h1>
        <p class="mp-lead">Соберите коллаж, скачайте его или добавьте в рамку MIGLIK.</p></section>
        <section class="mp-section"><h2>Что хотите создать?</h2>
        <a class="mp-button" href="{base}{path}">Создать коллаж</a></section>''')
    add(path, 'Коллаж из фото онлайн бесплатно | MIGLIK',
        'Создайте коллаж из нескольких фотографий онлайн. Настройте изображения и скачайте PNG бесплатно.',
        f'''<section class="mp-page-title"><h1>Сделайте коллаж из фотографий онлайн</h1>
        <p class="mp-lead">Добавьте от двух до шести снимков. Фотографии обрабатываются в вашем браузере.</p></section>
        <section class="mp-section" id="collage-editor"><h2>Создайте свой коллаж</h2>
        <link itemprop="stylesheet" rel="stylesheet" href="{base}site/tools/collage.css?v=frame-1">
        <div class="collage-workspace"><div class="collage-preview">
        <div class="collage-mockup"><canvas width="800" height="800" aria-label="Предпросмотр коллажа в рамке" aria-describedby="collage-preview-help"></canvas>
        <div class="collage-figures" aria-hidden="true"><span></span><span></span></div></div>
        <p id="collage-preview-help">Перетащите фото внутри ячейки. Масштаб и положение также можно настроить ползунками.</p>
        <label><input type="checkbox" name="guides" checked> Показать примерные места двух фигурок</label>
        <p>В конструкторе фигурки можно переставить. Разметка не попадёт в PNG.</p></div>
        <div class="collage-controls">
        <label>Фотографии <input type="file" accept="image/jpeg,image/png,image/webp" multiple></label>
        <label>Макет <select name="layout"><option value="grid">Ровная сетка</option><option value="hero">Большой снимок</option><option value="strip">Вертикальная подборка</option><option value="wide">Горизонтальная подборка</option><option value="polaroid">Полароиды</option></select></label>
        <label>Формат рамки <select name="ratio"><option value="M">M — прямоугольная</option><option value="L" selected>L — квадратная</option><option value="XL">XL — высокая</option></select></label>
        <label>Фон <input name="background" type="color" value="#faf9f6"></label>
        <label>Расстояние между фото <input name="gap" type="range" min="0" max="48" value="16"></label>
        <label>Снимок для настройки <select name="photo"></select></label>
        <label>Масштаб <input name="zoom" type="range" min="1" max="3" step=".05" value="1"></label>
        <label>Кадр по горизонтали <input name="x" type="range" min="0" max="1" step=".01" value=".5"></label>
        <label>Кадр по вертикали <input name="y" type="range" min="0" max="1" step=".01" value=".5"></label>
        <div class="mp-actions"><button type="button" data-move="-1">Снимок раньше</button><button type="button" data-move="1">Снимок позже</button></div>
        <div class="mp-actions"><button type="button" data-history="-1">Отменить</button><button type="button" data-history="1">Повторить</button></div>
        <div class="mp-actions"><button class="mp-button" type="button" data-download disabled>Скачать PNG</button>
        <button class="mp-button" type="button" data-transfer disabled>Добавить в рамку MIGLIK</button></div>
        <p role="status"></p></div></div></section>
        <section class="mp-section mp-copy"><h2>Как сделать коллаж?</h2>
        <p>Загрузите снимки, выберите макет и настройте кадр каждого фото. Скачайте PNG или установите коллаж как фон рамки.</p>
        <h2>Нужна регистрация?</h2><p>Коллаж можно создать и скачать бесплатно, без аккаунта.</p>
        <a class="mp-link" href="{base}tools/">Все инструменты</a></section>
        <script type="module" src="{base}site/tools/collage.js?v=frame-1"></script>''')
