# MIGLIK — интерактивный сайт персональных подарков

Главная: https://alinageminivolsip-ai.github.io/Mini-Brick-Studio/miglik/
Конструктор: https://alinageminivolsip-ai.github.io/Mini-Brick-Studio/studio/

## Запуск и сборка

Требуется Node.js 22+ и npm. В этой папке выполните `npm ci`, затем `npm run dev -- --port 5181`. Предпросмотр: http://127.0.0.1:5181/ . `npm test` проверяет контент, ссылки и исходники. `npm run build` создаёт обычный dist, `npm run build:main` — dist-main с публичным base `/Mini-Brick-Studio/miglik/`. Копировать dist-main в папку miglik репозитория, сохраняя previous.html и исторические assets. Не менять studio и общий каталог конструктора.

## Структура и поведение

`scripts/compose-page.mjs` собирает доступный статический HTML из `src/shell.html`, `src/hero.html`, `src/sections.html`, `src/content.mjs`. Важные тексты, ссылки, три истории, шесть поводов и десять FAQ доступны в исходном HTML. Один H1, семантические разделы, canonical, Open Graph, sitemap, robots и JSON-LD.

`src/hero-story.js` сохраняет утверждённую последовательность: фотография → герои → прозрачная рамка → прозрачная коробка → бант и бирка. GSAP ScrollTrigger, scrub, обычная прокрутка в обе стороны. Desktop перематывает два остановленных Kling MP4; mobile показывает извлечённые из них WebP-кадры. Отдельный экран фотографии людей после видео отсутствует. На desktop картинка первого экрана справа, на mobile — крупно над текстом. Кнопка конструктора видна сразу.

`src/commerce.js` содержит TextReveal, MemoryObjects, StoryGallery, ProcessTimeline, навигацию и измерения web-vitals. `src/sequence.js` — ApartmentSequence: 61 кадр реального MOV, два размера, максимум 10 декодированных кадров и два параллельных декодирования. Кнопки этапов синхронизированы со скроллом. Резерв места под pin предотвращает крупные сдвиги при запуске.

`?motion=reduce` или системный prefers-reduced-motion показывают читаемые статические главы и ручное переключение четырёх видов квартиры. `?debug=1` добавляет точки перехода и локальные LCP/INP/CLS; данные никуда не отправляются. FAQ — нативные details/summary, доступны с клавиатуры. Якорные ссылки и skip-link ведут к существующим разделам. Ссылки заказа ведут в действующий studio, индивидуальная квартира — в существующий VK-контакт.

## Карта ассетов

| Источник | Где используется |
| --- | --- |
| Ранее утверждённый Premium_ci_5637 → assets/intro-v2.mp4 | Первый экран, mobile intro-sequence-v2 |
| Ранее утверждённые frame-alpha.png / open-box-alpha.png | Рамка, проективное опускание в коробку; PNG и альфа сохранены |
| Ранее утверждённый Ultra_phot_5586 → assets/packaging-v2.mp4 | Бант, бирка, mobile packaging-sequence-v2, финальный стоп-кадр |
| assets/memories/floating-memories.png | Коллаж воспоминаний; responsive WebP memories-* и share.jpg |
| assets/hero/couple-frame.png | История пары; WebP couple-* |
| assets/stories/best-friends-shadowbox.png | История подруг; WebP friends-* |
| assets/stories/wedding-shadowbox.png | Свадебная история; WebP wedding-* |
| assets/appartment/apartment-transformation.mov | План → стены → мебель → рамка; 61 кадр в editorial/apartment/{small,large} и четыре key-* |
| Остальные исходники, включая старый hero/couple-transformation.mp4 и «ФОто главная» | Побайтовый архив editorial/originals; не подменяют более поздние утверждённые hero-материалы |

Все 16 содержательных файлов из `/Users/mac/Desktop/assets` скопированы без изменений, кроме служебных .DS_Store. SHA-256, размеры и пути: `qa/editorial/source-manifest.json`. Производные меняют только размер/формат. Новые изображения не генерировались. Составной коллаж воспоминаний анимируется целиком: независимых вырезанных объектов в исходниках нет. Визуально пустой PNG сохранён, но не используется как видимый сюжет.

## Ограничения

- Это новая главная с переходом в существующий конструктор. Его параметры, цены, корзина и интеграции не переписывались. Публикация не отправляет заказы и сообщения.
- Квартира обозначена как визуализация индивидуального направления. Онлайн-калькулятора квартиры, загрузки плана и обещания точной реконструкции нет.
- Цена, сроки, отзывы и условия доставки не выдуманы. Их уточнение предложено через действующие каналы.
- В квартире используется реальный видеоряд, а не свободно вращаемая 3D-модель. Рамка в коробке — 2D-проекция предоставленных PNG.
- Изображения уже содержат собственные белые/тёплые фоны. Они не удалены и не перерисованы. Белый фон страницы сохранён.
- Google Fonts — внешняя зависимость; предусмотрены системные fallback-шрифты. Без JS остаются статические главы, контент и ссылки; интерактивная квартира требует JS.
- robots.txt внутри проекта GitHub Pages не управляет корневым robots.txt домена. Для правил всего домена нужен доступ к пользовательскому репозиторию alinageminivolsip-ai.github.io. Sitemap доступен явно по /miglik/sitemap.xml. JSON-LD без фиктивных offers/ratings не гарантирует расширенную выдачу. Search Console и фактическая индексация не проверялись.
- Физический iPhone, Safari/WebKit, медленная сеть и полный Lighthouse-аудит не тестировались. См. точные выполненные проверки в `qa/editorial/QA.md`.

## Результаты и скриншоты

Отчёт: `qa/editorial/QA.md`. До: `01-before-home.png`, `02-before-final.png`, `03-before-constructor.png`. После: desktop/mobile hero, real-character, framed-gift, open-box, ribbon, hero-final, final-cta; apartment и stories. Папка `qa/editorial`. Некоторые технические снимки показывают диагностическую панель, отсутствующую на обычном сайте. Предыдущий README сохранён в `qa/README-before-editorial.md`.
