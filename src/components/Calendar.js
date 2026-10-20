import { h, cx, React, useCallback, useEffect, useId, useMemo, useRef, useState, useControllable } from '../react.js';
import { Icon } from '../icons.js';
import { TextField, Modal } from '../base.js';
import { Button } from './Button.js';
import { Popover } from './Popover.js';
import { describe } from '../doc.js';

/* ------------------------------------------------------------------ dates */

const pad = (n) => String(n).padStart(2, '0');
/** 'YYYY-MM-DD' <-> local Date (values are ISO date strings, like Astryx). */
const parse = (iso) => { if (!iso) return null; const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const day = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const monthStart = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const cmp = (a, b) => day(a).getTime() - day(b).getTime();
const spanDays = (a, b) => Math.round(Math.abs(cmp(a, b)) / 86400000) + 1;
const isRange = (v) => v && typeof v === 'object';
const WEEKDAYS = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
/** ISO 8601 week number. */
function isoWeek(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  return Math.ceil(((t - Date.UTC(t.getUTCFullYear(), 0, 1)) / 86400000 + 1) / 7);
}

/* --------------------------------------------------------------- Calendar */

export function Calendar({
  value, defaultValue, onValueChange, mode = 'single', focusDate, onFocusDateChange, min, max, dateConstraints, minRangeSpan = 1, maxRangeSpan,
  weekStartsOn = 0, numberOfMonths = 1, hasOutsideDays = true, hasVariableRowCount = false, hasWeekNumbers = false, locale, fluid = false, handleRef, className, ...rest
}) {
  const [selected, setSelected] = useControllable(value, defaultValue ?? null, onValueChange);
  const sel = mode === 'range' ? (isRange(selected) ? { start: parse(selected.start), end: parse(selected.end) } : null) : parse(typeof selected === 'string' ? selected : null);
  const first = mode === 'range' ? sel?.start : sel;
  const minD = parse(min);
  const maxD = parse(max);
  const today = useMemo(() => day(new Date()), []);
  const clamp = (d) => (minD && cmp(d, minD) < 0 ? minD : maxD && cmp(d, maxD) > 0 ? maxD : d);
  const [visibleIso, setVisibleIso] = useControllable(focusDate, iso(monthStart(first || clamp(today))), onFocusDateChange);
  const visible = monthStart(parse(visibleIso));
  const setVisible = (d) => setVisibleIso(iso(monthStart(d)));
  const [focus, setFocus] = useState(null);
  const [hover, setHover] = useState(null);
  const grid = useRef(null);
  const moved = useRef(false);
  const titleId = useId();
  const start = weekStartsOn in WEEKDAYS ? WEEKDAYS[weekStartsOn] : weekStartsOn;

  React.useImperativeHandle(handleRef, () => ({ navigateTo: (d) => setVisibleIso(iso(monthStart(typeof d === 'string' ? parse(d) : d))) }), [setVisibleIso]);

  const fmt = useMemo(() => ({
    month: new Intl.DateTimeFormat(locale, { month: 'long' }),
    monthYear: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
    weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
    weekdayLong: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
    long: new Intl.DateTimeFormat(locale, { dateStyle: 'full' }),
    number: new Intl.NumberFormat(locale),
  }), [locale]);
  const weekdays = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2023, 0, 1 + ((start + i) % 7)); // 2023-01-01 is a Sunday
    return { short: fmt.weekday.format(d).slice(0, 2), long: fmt.weekdayLong.format(d) };
  }), [fmt, start]);

  const picking = mode === 'range' && sel?.start && !sel.end;
  const disabled = (d) => {
    if ((minD && cmp(d, minD) < 0) || (maxD && cmp(d, maxD) > 0)) return true;
    if (dateConstraints && !dateConstraints.every((fn) => fn(d))) return true;
    if (picking && cmp(d, sel.start) > 0) {
      const n = spanDays(d, sel.start);
      if (maxRangeSpan && n > maxRangeSpan) return true;
      if (minRangeSpan > 1 && n < minRangeSpan) return true;
    }
    return false;
  };

  const months = Array.from({ length: numberOfMonths }, (_, i) => addMonths(visible, i));
  const inView = (d) => months.some((mo) => mo.getMonth() === d.getMonth() && mo.getFullYear() === d.getFullYear());
  const tabStop = focus && inView(focus) ? focus : first && inView(first) ? first : inView(today) ? today : visible;
  const goMonth = (n) => setVisible(addMonths(visible, n));
  const canPrev = !minD || cmp(addDays(visible, -1), minD) >= 0;
  const canNext = !maxD || cmp(addMonths(visible, numberOfMonths), maxD) <= 0;

  const pick = (d) => {
    if (disabled(d)) return;
    setFocus(d);
    if (!inView(d)) setVisible(d);
    if (mode === 'single') { setSelected(iso(d)); return; }
    if (!picking) { setSelected({ start: iso(d), end: null }); return; }
    if (cmp(d, sel.start) === 0) { if (minRangeSpan <= 1) setSelected({ start: iso(d), end: iso(d) }); else setSelected(null); return; }
    if (cmp(d, sel.start) < 0) setSelected({ start: iso(d), end: null });
    else setSelected({ start: sel.start && iso(sel.start), end: iso(d) });
  };

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    grid.current?.querySelector(`[data-date="${iso(tabStop)}"]`)?.focus();
  });

  const onKeyDown = (e) => {
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    let next = null;
    if (e.key in steps) next = addDays(tabStop, steps[e.key] * (rtl && Math.abs(steps[e.key]) === 1 ? -1 : 1));
    else if (e.key === 'Home') next = addDays(tabStop, -((tabStop.getDay() - start + 7) % 7));
    else if (e.key === 'End') next = addDays(tabStop, 6 - ((tabStop.getDay() - start + 7) % 7));
    else if (e.key === 'PageUp' || e.key === 'PageDown') {
      const t = addMonths(tabStop, e.key === 'PageUp' ? -1 : 1);
      next = new Date(t.getFullYear(), t.getMonth(), Math.min(tabStop.getDate(), new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()));
    }
    if (!next) return;
    e.preventDefault();
    moved.current = true;
    setFocus(next);
    if (!inView(next)) setVisible(cmp(next, visible) < 0 ? next : addMonths(next, -(numberOfMonths - 1)));
  };

  // While a range is being picked, hovering (or focusing) a later day previews the range up to it.
  const previewEnd = picking && hover && cmp(hover, sel.start) > 0 && !disabled(hover) ? hover : null;
  const inPreview = (d) => previewEnd && cmp(d, sel.start) > 0 && cmp(d, previewEnd) <= 0;
  const inRange = (d) => sel && mode === 'range' && sel.start && sel.end && cmp(d, sel.start) >= 0 && cmp(d, sel.end) <= 0;
  const title = numberOfMonths === 1 ? fmt.monthYear.format(visible) : `${fmt.monthYear.format(months[0])} – ${fmt.monthYear.format(months[months.length - 1])}`;

  const renderMonth = (mo) => {
    const y = mo.getFullYear();
    const m = mo.getMonth();
    const count = new Date(y, m + 1, 0).getDate();
    const lead = (new Date(y, m, 1).getDay() - start + 7) % 7;
    const cells = Array.from({ length: lead + count }, (_, i) => addDays(new Date(y, m, 1), i - lead));
    const total = hasVariableRowCount ? Math.ceil(cells.length / 7) * 7 : 42;
    while (cells.length < total) cells.push(addDays(cells[cells.length - 1], 1));
    const weeks = Array.from({ length: total / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
    return h('div', { key: iso(mo), role: 'grid', 'aria-label': fmt.monthYear.format(mo), 'aria-multiselectable': mode === 'range' || undefined, className: cx('bui-calendar__grid', hasWeekNumbers && 'bui-calendar__grid--weeks'), ref: mo === months[0] ? grid : undefined, onKeyDown },
      h('div', { role: 'row', className: 'bui-calendar__row' },
        hasWeekNumbers && h('div', { role: 'columnheader', className: 'bui-calendar__weekday bui-calendar__week-number', 'aria-label': 'Week' }),
        weekdays.map((w) => h('div', { key: w.long, role: 'columnheader', 'aria-label': w.long, className: 'bui-calendar__weekday' }, w.short))),
      weeks.map((week, i) => h('div', { key: i, role: 'row', className: 'bui-calendar__row' },
        hasWeekNumbers && h('div', { role: 'rowheader', className: 'bui-calendar__week-number' }, fmt.number.format(isoWeek(addDays(week[0], 3)))),
        week.map((d, j) => {
          const outside = d.getMonth() !== m;
          if (outside && (!hasOutsideDays || numberOfMonths > 1 && inView(d))) return h('div', { key: j, role: 'gridcell', className: 'bui-calendar__cell' });
          const rs = sel && mode === 'range' && sel.start && cmp(d, sel.start) === 0;
          const re = sel && mode === 'range' && sel.end && cmp(d, sel.end) === 0;
          const on = mode === 'single' ? !!sel && cmp(d, sel) === 0 : !!(rs || re);
          const off = disabled(d);
          const isToday = cmp(d, today) === 0;
          const ranged = inRange(d);
          return h('div', { key: j, role: 'gridcell', 'aria-selected': on || (ranged || undefined), className: cx('bui-calendar__cell', ranged && 'bui-calendar__cell--range', inPreview(d) && 'bui-calendar__cell--preview', previewEnd && rs && 'bui-calendar__cell--preview-start', previewEnd && cmp(d, previewEnd) === 0 && 'bui-calendar__cell--preview-end', rs && sel.end && cmp(sel.start, sel.end) !== 0 && 'bui-calendar__cell--start', re && cmp(sel.start, sel.end) !== 0 && 'bui-calendar__cell--end') },
            h('button', {
              type: 'button', 'data-date': iso(d), tabIndex: cmp(d, tabStop) === 0 && !outside ? 0 : -1, 'aria-label': fmt.long.format(d), 'aria-disabled': off || undefined,
              'aria-current': isToday ? 'date' : undefined, 'aria-pressed': on,
              className: cx('bui-calendar__day', on && 'bui-calendar__day--selected', isToday && 'bui-calendar__day--today', outside && 'bui-calendar__day--outside', off && 'bui-calendar__day--disabled'),
              onClick: () => pick(d), onFocus: () => { setFocus(d); setHover(d); }, onBlur: () => setHover(null), onPointerEnter: (e) => { if (e.pointerType === 'mouse') setHover(d); }, onPointerLeave: () => setHover(null),
            }, fmt.number.format(d.getDate())));
        }))));
  };

  return h('div', { className: cx('bui-calendar', fluid && 'bui-calendar--fluid', className), ...rest },
    h('div', { className: 'bui-calendar__header' },
      h('button', { type: 'button', className: 'bui-calendar__nav', 'aria-label': 'Previous month', disabled: !canPrev, onClick: () => goMonth(-1) }, h(Icon, { name: 'chevronLeft', size: 24 })),
      h('div', { id: titleId, className: 'bui-calendar__title', 'aria-live': 'polite' }, title),
      h('button', { type: 'button', className: 'bui-calendar__nav', 'aria-label': 'Next month', disabled: !canNext, onClick: () => goMonth(1) }, h(Icon, { name: 'chevronRight', size: 24 }))),
    h('div', { className: 'bui-calendar__months' }, months.map(renderMonth)));
}
describe(Calendar, 'A month grid for picking a date or a date range.', {
  value: ['ISODateString | { start: ISODateString | null; end: ISODateString | null } | null', null, 'Selected date (`YYYY-MM-DD`), or the range when `mode="range"` (controlled)'],
  defaultValue: ['ISODateString | { start, end } | null', null, 'Initial selection (uncontrolled)'],
  onValueChange: ['(value) => void', null, 'Called when the selection changes; a range is complete when `end` is set'],
  mode: ["'single' | 'range'", "'single'", 'One date or a range of two'],
  focusDate: ['ISODateString', null, 'Visible month (controlled). Unset, the calendar opens on the selection, else today clamped into min/max'],
  onFocusDateChange: ['(focusDate: ISODateString) => void', null, 'Called when the visible month changes'],
  min: ['ISODateString', null, 'Earliest selectable date'],
  max: ['ISODateString', null, 'Latest selectable date'],
  dateConstraints: ['Array<(date: Date) => boolean>', null, 'Custom rules: a date is selectable when every function returns true (for example weekdays only)'],
  minRangeSpan: ['number', '1', 'Range mode: fewest days a range may span, both ends counted (2 forbids a one-day range)'],
  maxRangeSpan: ['number', null, 'Range mode: most days a range may span, both ends counted (7 is a 7-day window)'],
  weekStartsOn: ["0 | 1 | 2 | 3 | 4 | 5 | 6 | 'sun' | 'mon' | …", '0', 'First day of the week: 0 or `sun` is Sunday, 1 or `mon` is Monday'],
  numberOfMonths: ['1 | 2', '1', 'Months shown side by side'],
  hasOutsideDays: ['boolean', 'true', 'Show days from adjacent months'],
  hasVariableRowCount: ['boolean', 'false', 'Rows as needed instead of a fixed 6-row grid'],
  hasWeekNumbers: ['boolean', 'false', 'Show ISO week numbers'],
  locale: ['string', null, 'BCP 47 locale for month, weekday and number names (browser default)'],
  fluid: ['boolean', 'false', 'Fill the container width; the days stretch (used in the dialog)'],
  handleRef: ['Ref<{ navigateTo(date) }>', null, 'Imperative handle: `navigateTo(date)` shows that month'],
});

/* ------------------------------------------------------------- DatePicker */

function useNarrow(query) {
  const sub = useCallback((cb) => { const q = window.matchMedia(query); q.addEventListener('change', cb); return () => q.removeEventListener('change', cb); }, [query]);
  return React.useSyncExternalStore(sub, () => window.matchMedia(query).matches, () => false);
}

export function DatePicker({
  value, defaultValue, onValueChange, mode = 'single', label = 'Date', presentation = 'auto', locale, min, max, dateConstraints, weekStartsOn,
  confirmLabel = 'Apply', cancelLabel = 'Cancel', className, ...field
}) {
  const [selected, setSelected] = useControllable(value, defaultValue ?? null, onValueChange);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(selected);
  const sheet = useNarrow('(max-width: 1200px)');
  const asDialog = presentation === 'dialog' || (presentation === 'auto' && sheet);
  const fmt = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }), [locale]);
  const text = mode === 'range'
    ? (isRange(selected) && selected.start ? `${fmt.format(parse(selected.start))}${selected.end ? ` – ${fmt.format(parse(selected.end))}` : ' – …'}` : '')
    : (typeof selected === 'string' ? fmt.format(parse(selected)) : '');
  const cal = { mode, locale, min, max, dateConstraints, weekStartsOn };

  // The whole field is the trigger: a click on the icon or the padding opens it too, not only a click on the input.
  const trigger = (extra = {}) => h('div', {
    className: 'bui-datepicker__field', onClick: extra.onClick,
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); extra.onClick?.(); } },
  }, h(TextField, {
    ...field, label, readOnly: true, value: text, onChange: () => {}, startIcon: h(Icon, { name: 'calendar', size: field.size === 'sm' ? 20 : 24 }),
    // The label stays full size until a date is chosen, then it floats like in Text Input.
    floatingLabel: field.floatingLabel !== false && !!text,
    'aria-haspopup': 'dialog', 'aria-expanded': extra['aria-expanded'], 'aria-controls': extra['aria-controls'],
  }));

  if (asDialog) {
    return h('div', { className: cx('bui-datepicker', className) },
      trigger({ onClick: () => { setDraft(selected); setOpen(true); }, 'aria-expanded': open }),
      h(Modal, {
        open, onOpenChange: setOpen, title: label, height: 'content',
        primaryAction: h(Button, { onClick: () => { setSelected(draft); setOpen(false); } }, confirmLabel),
        secondaryAction: h(Button, { variant: 'secondary', onClick: () => setOpen(false) }, cancelLabel),
      }, h(Calendar, { ...cal, fluid: true, value: draft, onValueChange: setDraft })));
  }
  return h(Popover, {
    className: cx('bui-datepicker', className), panelClassName: 'bui-datepicker__panel', matchWidth: true, open, onOpenChange: setOpen, label, placement: 'bottom-start',
    trigger: (p) => trigger({ onClick: p.onClick, 'aria-expanded': p['aria-expanded'], 'aria-controls': p['aria-controls'] }),
  }, h(Calendar, { ...cal, fluid: true, value: selected, onValueChange: (v) => { setSelected(v); if (mode === 'single' || (isRange(v) && v.end)) setOpen(false); } }));
}
describe(DatePicker, 'A date field. It opens the calendar in a popover, and in a Dialog sheet on small screens. The field is a Text Input, so its size, variant, label and status come from Text Input.', {
  value: ['ISODateString | { start, end } | null', null, 'Selected date or range (controlled)'],
  defaultValue: ['ISODateString | { start, end } | null', null, 'Initial selection (uncontrolled)'],
  onValueChange: ['(value) => void', null, 'Called when a date (or a complete range) is chosen'],
  mode: ["'single' | 'range'", "'single'", 'One date or a range of two'],
  presentation: ["'auto' | 'popover' | 'dialog'", "'auto'", 'Where the calendar opens: auto uses the dialog up to 1200px'],
  confirmLabel: ['string', "'Apply'", 'Dialog apply button text'],
  cancelLabel: ['string', "'Cancel'", 'Dialog cancel button text'],
  min: ['ISODateString', null, 'Earliest selectable date'],
  max: ['ISODateString', null, 'Latest selectable date'],
  dateConstraints: ['Array<(date: Date) => boolean>', null, 'Custom rules: a date is selectable when every function returns true'],
  weekStartsOn: ['0 | 1 | 2 | 3 | 4 | 5 | 6 | \'mon\' | …', '0', 'First day of the week'],
  locale: ['string', null, 'BCP 47 locale for names and the formatted value'],
});
