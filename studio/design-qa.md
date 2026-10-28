# Проверка MIGLICK — 28.10.2026

Визуальный ориентир: существующий лендинг MIGLIK/MIGLICK, кремовый фон #F8F7F2, фиолетовый #6654F4, тёмный #26263A, локальные Onest и Unbounded. Компоновка конструктора намеренно рассчитана на редактирование, а не повторяет hero лендинга.

| Before | After | Why |
| --- | --- | --- |
| Блокирующее вступление | Сразу доступен герой и первый шаг | Можно начать создание без вводного экрана |
| Перегруженная палитра | Популярные цвета и раскрываемая полная палитра | Упрощён первый выбор, все оттенки сохранены |
| Неустойчивая компоновка на узком экране | Превью, полоса героев, прокручиваемые детали, закреплённые кнопки | Следующий шаг всегда доступен |
| Смена масштаба героя между деталями | Стабильный масштаб и отдельная кнопка «Крупнее» | Выбранная деталь не меняет положение всей фигуры |
| Пустой новый черновик попадал в заказ | После сохранённой рамки включается только начатый черновик | Нет лишней рамки и удвоения стоимости |
| Старый розовый шаблон MiniBrick | Кремовый экспорт MIGLICK 1080×1920 | Согласованность с новым сайтом |
| Ошибка хранилища могла остановить загрузку | Защищённое чтение/запись и безопасные значения | Конструктор открывается при повреждённых данных |

Проверены размеры 320×700, 375×812, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080: нет горизонтального переполнения, доступна кнопка следующего шага. Проверены изменение волос и отмена, добавление/удаление героя и отмена удаления, поля имени/заметки, выбор рамки, крупный просмотр и Escape, подготовка изображения заказа, заказ с одной сохранённой рамкой. Девять автоматических проверок пройдены.

Ограничения: физические iOS/Android не проверялись. Подготовка PNG подтверждена по изображению 1080×1920; автоматическое подтверждение сохранения файла в системной папке Downloads не выполнялось. Онлайн-оплата и автоматическая отправка заказа отсутствовали в исходнике и не добавлялись.

После проверки публикации последовательные сетевые пробы ассетов заменены статическим списком реальных растровых файлов. PSD, ошибочно названный A7.png в оригинале, исключён из каталога доступных лиц. Локально после повторного открытия нет видимых незагруженных изображений.

## Mobile rotation controls — follow-up

| Before | After | Why |
| --- | --- | --- |
| Controls inherited a wide box, top:50% and an absolutely placed label | Explicit edge inset, auto width/top and static label | Buttons stay beside the preview, clear of the figure and people strip |
| Portrait-only stack left little room in landscape | Preview left, editor right on short wide screens | Details remain scrollable and next step remains visible |

Browser checks: 320×700, 390×844, 768×1024, 844×390, 1024×768, 1440×900. Rotation controls stayed inside the viewer, did not intersect figure bounds, no horizontal overflow, next button visible. Both front/back buttons tested. Physical device testing remains pending.

## Branded loading screen

| Before | After | Why |
| --- | --- | --- |
| Interface painted before catalog and visible figure assets were ready | Cream/violet MIGLICK loader waits for catalog, fonts and visible figure images, with bounded waits | Gives a composed entry without showing incomplete layers |
| No entry state | Brief 620ms minimum, 240ms opacity exit, static reduced-motion indicator | Avoids a one-frame flash; matches landing typography |

Verified browser screenshots at desktop and 320×700, loader auto-closes, aria-busy clears and next-step button works. Refresh preserves the existing two-person draft. No console errors in the checked session. Failed startup offers retry after 12 seconds; this fallback was code-reviewed, not simulated in the browser.

## Complete asset preload

Supersedes previous short bounded-loader behavior: all 64 valid shipped images and four local font subsets must finish before the loading screen exits. Six concurrent image requests avoid a burst; progress counts only successful files. Failed requests keep the editor locked with retry. Cached visits have a 1.8-second minimum. Images/fonts use scoped versioned caching.

Browser confirmed 68/68 before automatic exit, no console errors. Twelve tests passed, including new cases proving the loader waits for the final image and keeps retry visible after image/font failure.

Sheen follow-up: a narrow clipped light band crosses stationary MIGLICK glyphs left-to-right; disabled for reduced motion. Public asset audit found two Unicode red-background URLs returning 404; ASCII red.jpg aliases replace those URLs in inventory and catalog without changing saved background ids.
