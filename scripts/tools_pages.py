"""Static entry points for the creative tools."""


def add_tools(add, base):
    path = 'tools/kollazh-iz-foto/'
    styles = f'<link rel="stylesheet" href="{base}site/tools/collage.css?v=ux-3">'
    photos = [
        ('collection', 'Коллекция рамок с фигурками'),
        ('dresser', 'Рамка с фигурками на комоде'),
        ('minifigure-macro', 'Минифигурки крупным планом'),
    ]
    tiles = ''.join(f'<img src="{base}editorial/integration/{file}.webp" alt="{alt}" decoding="async">' for file, alt in photos)
    layouts = [('wide', 'Два рядом'), ('four', 'Четыре фото'), ('hero', 'Большой и два малых'),
               ('polaroid', 'Полароиды'), ('asymmetric', 'Асимметрия')]
    choices = ''.join(
        f'<button type="button" data-layout="{value}" aria-pressed="{str(value == "wide").lower()}">'
        f'<span class="layout-diagram layout-{value}" aria-hidden="true"><i></i><i></i><i></i><i></i></span>{label}</button>'
        for value, label in layouts
    )
    add('tools/', 'Бесплатные инструменты для фото и открыток | MIGLIK',
        'Создайте коллаж из фотографий бесплатно и используйте его в рамке MIGLIK.',
        f'''<section class="mp-page-title"><h1>Бесплатные инструменты для фотографий</h1>
        <p class="mp-lead">Создавайте коллажи, добавляйте надписи и оформляйте важные даты. Скачивайте результат бесплатно или используйте его в персональной рамке MIGLIK.</p></section>
        {styles}<section class="mp-section tools-feature">
        <div><h2>Коллаж из фотографий</h2><p>Соберите от двух до шести снимков. Выберите макет, настройте кадры и скачайте PNG бесплатно.</p>
        <a class="mp-button" href="{base}{path}">Создать коллаж</a></div>
        <div class="tools-sample">{tiles}</div></section>''')
    add(path, 'Коллаж из фото онлайн бесплатно | MIGLIK',
        'Создайте коллаж из нескольких фотографий онлайн. Настройте изображения и скачайте PNG бесплатно.',
        f'''<section class="mp-page-title"><h1>Сделайте коллаж из фотографий онлайн</h1>
        <p class="mp-lead">Добавьте от двух до шести снимков. Фотографии обрабатываются в вашем браузере.</p></section>
        <section class="mp-section" id="collage-editor"><h2>Создайте свой коллаж</h2>
        {styles}
        <div class="collage-workspace"><div class="collage-preview">
        <div class="collage-mockup"><div class="collage-empty">Ваши фотографии появятся здесь</div><canvas width="800" height="800" aria-label="Предпросмотр коллажа в рамке" aria-describedby="collage-preview-help"></canvas>
        <div class="collage-figures" aria-hidden="true"><span></span><span></span></div></div>
        <p id="collage-preview-help">Перетащите фото внутри ячейки. Масштаб и положение также можно настроить ползунками.</p>
        <label><input type="checkbox" name="guides" checked> Показать примерные места двух фигурок</label>
        <p>В конструкторе фигурки можно переставить. Разметка не попадёт в PNG.</p></div>
        <div class="collage-controls">
        <label class="collage-upload">Добавить фотографии<input type="file" accept="image/jpeg,image/png,image/webp" multiple></label>
        <div role="group" aria-label="Макет" class="layout-picker">{choices}</div><p class="layout-hint" role="status"></p>
        <select name="layout" hidden aria-label="Выбранный макет"><option value="wide">Два рядом</option><option value="four">Четыре фото</option><option value="hero">Большой и два малых</option><option value="polaroid">Полароиды</option><option value="asymmetric">Асимметрия</option><option value="grid">Сетка</option><option value="strip">Вертикальная подборка</option></select>
        <label>Формат рамки <select name="ratio"><option value="M">M — прямоугольная</option><option value="L" selected>L — квадратная</option><option value="XL">XL — высокая</option></select></label>
        <details class="collage-adjust"><summary>Настроить фотографии и фон</summary>
        <label>Фон <input name="background" type="color" value="#faf9f6"></label>
        <label>Расстояние между фото <input name="gap" type="range" min="0" max="48" value="16"></label>
        <label>Снимок для настройки <select name="photo"></select></label>
        <label>Масштаб <input name="zoom" type="range" min="1" max="3" step=".05" value="1"></label>
        <label>Кадр по горизонтали <input name="x" type="range" min="0" max="1" step=".01" value=".5"></label>
        <label>Кадр по вертикали <input name="y" type="range" min="0" max="1" step=".01" value=".5"></label>
        <div class="mp-actions"><button type="button" data-move="-1">Снимок раньше</button><button type="button" data-move="1">Снимок позже</button></div>
        <div class="mp-actions"><button type="button" data-history="-1">Отменить</button><button type="button" data-history="1">Повторить</button></div>
        </details><p role="status" aria-live="polite"></p></div></div>
        <div class="mp-actions collage-actions"><button class="mp-button" type="button" data-download disabled>Скачать бесплатно</button>
        <button class="mp-button" type="button" data-transfer disabled>Добавить в рамку MIGLIK</button></div>
        </section>
        <section class="mp-section mp-copy"><h2>Как сделать коллаж</h2>
        <ol><li>Загрузите фотографии.</li><li>Выберите макет.</li><li>Настройте расположение.</li><li>Скачайте результат или добавьте его в рамку.</li></ol>
        <h2>Примеры макетов</h2><div class="tools-examples"><figure><div class="tools-sample tools-sample-pair">{tiles}</div><figcaption>Два снимка рядом</figcaption></figure><figure><div class="tools-sample">{tiles}</div><figcaption>Один крупный и два маленьких</figcaption></figure></div>
        <h2>Нужна регистрация?</h2><p>Коллаж можно создать и скачать бесплатно, без аккаунта.</p>
        <a class="mp-link" href="{base}tools/">Все инструменты</a></section>
        <script type="module" src="{base}site/tools/collage.js?v=ux-2"></script>''')
