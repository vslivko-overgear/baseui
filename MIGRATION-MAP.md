# `@og/ui-system` → baseui-kit: таблица соответствия

Источник данных: `og-frontend-monorepo` @ `07f7927` (shallow) и `baseui` `main`.
Счётчики получены скриптом по `import … from '@og/ui-system…'` и `<Имя …>` в `apps/*/src`.
**Колонка «JSX»** — вхождения `<Имя` по приложениям `legacy / fe-4 / landings / paragon`. Для общих имён
(`Header`, `Price`, `Description`, `Quantity`) в JSX могут попасть локальные одноимённые компоненты, поэтому
для них доверяйте колонке «imports».

> **Важно про `og-frontend` (legacy).** Он почти не использует `@og/ui-system` (7 импортов): у него своя
> типографика `components/atoms/typography`. Цифры `Body/Heading` в колонке legacy — это его локальные
> компоненты, а не `ui-system`. Реально мигрировать надо `fe-4`, `landings`, `paragon`.

Уровень совпадения: 🟢 прямой аналог, API близкий · 🟡 аналог есть, API отличается · 🟠 частичный аналог / композиция · 🔴 аналога нет.

## 1. Типографика (больше всего использований)

| ui-system | imports | JSX (leg/fe4/land/par) | baseui | Уровень | Расхождения |
|---|---|---|---|---|---|
| `Body` (`size: xs/s/l/xl`, `as: p/span/div/label`, `asChild`) | 459 | 340/479/307/169 | нет компонента; утилиты Tailwind `type-text-12/14/16/20-{regular,semi-bold,bold}` | 🟠 | Нет компонента: нужен тонкий `Body`-враппер над `type-text-*`. Маппинг размеров xs/s/l/xl → 12/14/16/20 нужно сверить с дизайном (в ui-system вес `font-medium`, в baseui регулярный/semi-bold/bold). |
| `Heading` (`level 1–6`, адаптив `*-mobile`/`tablet:`) | 206 | 239/145/104/9 | утилиты `type-header-{56,48,40,32,28,24,20}` | 🟠 | Нет компонента; в ui-system адаптивность (mobile/tablet) зашита в level, в baseui её надо задавать явно. Нужен враппер. |
| `Caption` (`size`) | 102 | 25/78/79/34 | `type-text-12-*` | 🟠 | То же: враппер. |
| `Overline` | 45 | 13/11/28/19 | нет (uppercase 12px bold) | 🔴 | Свой стиль, вынести в overgear-слой. |

## 2. Базовые элементы форм и действий

| ui-system | imports | JSX | baseui | Уровень | Расхождения props |
|---|---|---|---|---|---|
| `Button` | 227 | 206/227/33/59 | `Button` | 🟡 | `text` → `label`/`children`; `size` `w2l/l/m/s/xs/xxs` → `lg/md/sm/xsm` (4 размера вместо 6); `variant` 11 штук (`success, primary, secondary, tertiary, text, discord, white, error, cta, promo-gold, promo-gold-glowing`) → 4 (`primary, secondary, ghost, destructive`); `state` (`loading/success/error`) → `loading`; `leftIcon/rightIcon` → `icon` + `endContent`; `asChild` (Radix) → нужна проверка. **`cta`, `promo-*`, `discord`, `white`, `success` остаются в overgear-слое.** |
| `Input` (+`PasswordInput`, `InputLabel`, `Description`) | 58 | 98/65/4/20 | `TextInput` | 🟡 | `hasError`+`errorText` → `status="error"`+`caption`; `description` → `caption`; `size s/m/l` → `sm/md` (48/56px); `variant` другой набор (`filled/standard`); `name` обязателен в ui-system, в baseui нет; `iconSize`, `onReveal` (пароль) — проверить. |
| `Textarea` | 9 | 19/5/0/5 | нет отдельного (проверить `TextInput multiline`) | 🟠 | `hasError/errorText/description` → `status/caption`; `autoResize`, `rows`. |
| `Checkbox` | 19 | 27/16/1/2 | `Checkbox` | 🟢 | `onCheckedChange(checked)` совпадает; `error` текстом; размеры `sm/md`. |
| `Toggle` | 15 | 11/12/0/4 | `Switch` | 🟢 | Переименование; `onCheckedChange` совпадает. |
| `Switch` (shadcn) | 1 | 2/1/0/0 | `Switch` | 🟢 | Дубликат `Toggle`. |
| `RadioButton`/`RadioButtonGroup`, `RadioGroup`/`RadioGroupItem` | 6/6/9/10 | 5/4/0/2 · 0/4/0/2 · 0/8/1/0 · 22/8/2/0 | `Radio`, `RadioGroup` | 🟡 | Две параллельные реализации в ui-system → одна в baseui; `withBackground`, `label`. |
| `Dropdown` | 29 | 23/9/0/5 | `Dropdown` | 🟡 | ui-system: `options[{label:string,value}]`, `onChange(item)`, `placeholder`, `mobileTitle`, `applyLabel`; baseui: `options` с группами/иконками, `onValueChange(value)`, `value` — строка, `multiple`, `trigger`. |
| `Combobox` | 7 | 18/3/1/0 | `Typeahead` | 🟡 | `value` — объект `{label,value}` → строка; `onChange(item)` → `onValueChange(value)`; `emptyText`, `iconLeft`. |
| `Multiselect` | 4 | 14/2/0/0 | `Selector multiple` / `Typeahead multiple` | 🟡 | `value` — массив объектов → массив строк. |
| `Listbox` | — | — | `Selector` | 🟡 | — |
| `MultiRangeSlider` | 2 | 0/1/1/0 | `Slider` (проверить диапазон) | 🟠 | — |
| `Hint` | 20 | 34/11/4/5 | нет | 🔴 | Иконка-подсказка с мобильным подтверждением (`title/content/confirmLabel`): собрать из `Tooltip`+`Dialog`. |
| `Tooltip` (+`TooltipProvider`, `ResponsiveTooltip`) | 31 | 29/33/3/2 | `Tooltip` | 🟡 | `variant`, `rounded` (ui-system) → `placement`, `delay`, `content` (baseui); провайдер не нужен. |
| `SegmentControls` (+Item) | 4 | 2/2/0/2 | `SegmentedControl` | 🟡 | `variant connected/pill` → проверить; размеры `s/m/l`. |
| `PaginationBar` | 7 | 1/11/0/0 | `Pagination` | 🟡 | `currentPage/totalPages/onPageChange` → проверить имена. |
| `Skeleton` | 58 | 16/162/3/38 | `Skeleton` | 🟢 | `variant default/text/circular/rectangular` → проверить; `animate`. |
| `Badge` / `ProductBadge` / `BadgeWithTimer` | 4/3/0 | 0/0/0/5 · 0/2/1/0 | `Badge` | 🟡 | `ProductBadge` — продуктовый. |
| `Banner` (+`BannerContent`) | 2 | 0/2/0/0 | `Banner` | 🟡 | — |
| `Separator` | 8 | 2/7/0/16 | `Divider` | 🟢 | Переименование. |
| `LoaderSpinner`, `LoaderOvergear` | 4/17 | 0/4/0/0 · 0/13/0/4 | `Spinner` | 🟠 | `LoaderOvergear` — брендовый, в overgear-слой. |

## 3. Оверлеи и контейнеры (shadcn/Radix → Base UI)

| ui-system | imports | JSX | baseui | Уровень | Расхождения |
|---|---|---|---|---|---|
| `Dialog`+`Content/Title/Description/Close/Portal` | 2 | 0/12/2/6 | `Dialog` | 🟡 | Составной API Radix → один компонент с `title`, `open`, `onOpenChange(open, details)`; `data-dialog-close` для закрытия. |
| `Drawer`+`Content/Header/Body/Footer/Title/Close` (vaul) | 11 | 0/8/0/3 | `Dialog` (sheet) / `ChoiceSheet` / `BottomBar` | 🟠 | `vaul` (жесты, scale background) → нет прямого аналога; `direction`, `repositionInputs`. |
| `Popover`+`Content/Trigger` | 5 | 0/2/0/4 | `Popover` | 🟡 | Составной → проверить. |
| `HoverCard`+`Content/Trigger` | 4 | 0/1/0/3 | нет | 🔴 | `Popover`/`Tooltip` с hover либо оставить. |
| `DropdownMenu`+`Content/Trigger` | 3 | 0/0/0/3 | `Dropdown` (`selectable={false}`) | 🟡 | Меню действий. |
| `Accordion`+Item/Trigger/Content | 5 | 0/2/3/0 | `Collapsible` / `CollapsibleGroup` | 🟡 | — |
| `Avatar`+Fallback/Image | 2 | 0/0/0/2 | `Avatar` | 🟢 | — |
| `Card`+Content/Title | 1 | 1/2/0/0 | `Card` | 🟢 | — |
| `Carousel`+Content/Item/Next/Previous (embla) | 5 | 1/4/1/0 | нет | 🔴 | Оставить `embla` в overgear-слое. |
| `AspectRatio`, `Slider` | — | — | `Slider` (есть), `AspectRatio` (нет) | 🟠 | — |
| `Form` (react-hook-form), `Label` | — | — | `Form`, `FormRow`, `FormSection` | 🟡 | RHF-интеграцию надо сохранить; `Form` baseui — лэйаут без RHF. |

## 4. Продуктовые компоненты Overgear (в baseui аналога нет — переносить как есть)

`OfferCard`, `ProductCard` (есть `ProductCard` в baseui, но другой), `CartProductCard`
(+`Price`, `RemoveButton`, `Quantity`, `OutOfStock`, `WarningMessage`), `PurchaseBottomBlock`/`PriceBlock`,
`PurchaseWidgetTimer`, `CountdownTimer`, `NextRaidBadge`, `OrdersLimitsBar`, `PaymentMethods`, `StepProgressBar`,
`SocialButton`, `CalendarEventDate`, `OfferSellingPoints`, `WarningBanner`, `Header`, `Footer`, `FooterMenuList`.
Это порядка 20 компонентов; их нужно перестроить на примитивах baseui и положить в `overgear/`-слой (или остаться в `ui-system`).

## 5. Иконки

`@og/ui-system/atoms` экспортирует много `*Icon` (свои SVG) и `*IconLucide`. Самые частые: `XIconLucide` (23),
`BonusIcon` (11), `StarIcon` (9), `ZapIconLucide` (8), `Chevron*IconLucide`, `CheckIconLucide`.
В baseui свои наборы `icons/line` и `icons/solid`; пересечение по lucide-иконкам надо проверить, брендовые
(`BonusIcon`, `DiscordIcon`) оставить. Правило ENG-834 (ESLint) потребует переписать.

## 6. Итоговая оценка

| Группа | Компонентов | Использований (≈, без legacy) | Трудоёмкость |
|---|---|---|---|
| 🟢 прямой аналог (Checkbox, Toggle/Switch, Skeleton, Separator, Avatar, Card) | ~7 | ~100 | низкая, переименование |
| 🟡 аналог с другим API (Button, Input, Dropdown, Combobox, Dialog, Popover, Tooltip, Radio, Pagination, Segment…) | ~20 | ~600 | средняя; **Button (~320 мест, 11 вариантов → 4) главный риск** |
| 🟠 нужен враппер (Body, Heading, Caption, Drawer, Textarea…) | ~8 | **~1100** (типографика) | средняя: один раз сделать враппер, затем codemod |
| 🔴 аналога нет (Overline, Hint, HoverCard, Carousel, ~20 продуктовых) | ~25 | ~120 | высокая; остаётся в overgear-слое |

**Вывод.** Основной объём (≈ 1100 вхождений) — типографика, и он решается одним враппером `Body/Heading/Caption` над
утилитами `type-*` плюс codemod. Реальные риски два: **`Button`** (нет 7 из 11 вариантов, они брендовые) и
**формы** (`Input`/`Dropdown`/`Combobox`: другие props и модель значения). Остальное — продуктовый слой, который
в любом случае остаётся «своим».

Не проверено: фактическая визуальная эквивалентность (размеры, токены цвета, шрифты), наличие `Textarea`
и `AspectRatio` в baseui, детали props у `Pagination`, `SegmentedControl`, `Slider`, `Popover`.
