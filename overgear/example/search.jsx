// The search of the header. On a desktop a dropdown under the field suggests games and offers as you type (arrows and Enter work, Escape closes it); on a phone the field opens a screen of its
// own with the field on top and the suggestions under it. With nothing typed both show the recent searches and the popular games.
import { createPortal } from 'react-dom';
import { useState, useRef, useEffect, useId } from '../../src/react.js';
import { TextInput } from '../../src/components/TextInput.jsx';
import { IconButton } from '../../src/components/Button.jsx';
import { ControlRow } from '../../src/components/Layout.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { go, useMedia } from './util.js';
import { gameOf, money } from './data.js';
import { suggest, withRecent, readRecent, keepRecent } from './suggest.js';

/** The rows of the suggestions, in the order they are shown: [{ id, group, kind, text, sub, image, run }]. `search(text)` runs a search, `open(path)` goes to a page. */
function rowsFor(query, recent, search, open) {
  const s = suggest(query, recent);
  const rows = [];
  if (s.empty) {
    for (const text of s.recent) rows.push({ id: `recent-${text}`, group: 'Recent searches', kind: 'recent', text, run: () => search(text) });
    for (const g of s.popular) rows.push({ id: `popular-${g.slug}`, group: 'Popular games', kind: 'game', text: g.name, sub: 'Game', image: g.cover, run: () => open(`/games/${g.slug}`) });
    return rows;
  }
  for (const g of s.games) rows.push({ id: `game-${g.slug}`, group: 'Games', kind: 'game', text: g.name, sub: g.category, image: g.cover, run: () => open(`/games/${g.slug}`) });
  for (const o of s.offers) rows.push({ id: `offer-${o.id}`, group: 'Offers', kind: 'offer', text: o.title, sub: `${gameOf(o.game)?.name || ''} · ${money(o.price)}`, image: o.image, run: () => open(`/offer/${o.id}`) });
  rows.push({ id: 'query', group: null, kind: 'query', text: `Search for “${query.trim()}”`, run: () => search(query) });
  return rows;
}

/** The list of suggestions: groups with a title, rows with a picture, a text and a line under it. The row marked `active` is the one the arrows are on. */
function Suggestions({ rows, active, listId, onPick, onHover }) {
  let group;
  return (
    <ul className="og-sg" role="listbox" id={listId} aria-label="Suggestions">
      {rows.map((row, i) => {
        const title = row.group !== group && row.group ? row.group : null;
        group = row.group;
        return (
          <li key={row.id} role="presentation">
            {title && <p className="og-sg__group" role="presentation">{title}</p>}
            <div id={`${listId}-${row.id}`} role="option" aria-selected={i === active} className="og-sg__row" data-active={i === active || undefined} data-kind={row.kind} onMouseDown={(e) => e.preventDefault()} onMouseEnter={() => onHover(i)} onClick={() => onPick(row)}>
              {row.image ? <img className="og-sg__pic" src={row.image} alt="" width="40" height="40" loading="lazy" draggable="false" /> : <span className="og-sg__pic og-sg__pic--icon" aria-hidden="true"><Icon name={row.kind === 'recent' ? 'Clock' : 'SearchSm'} size={20} /></span>}
              <span className="og-sg__text"><span className="og-sg__name">{row.text}</span>{row.sub && <span className="og-sg__sub">{row.sub}</span>}</span>
              {row.kind === 'recent' && <Icon name="ArrowUpLeft" size={20} aria-hidden="true" />}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** What the field and the suggestions share: the text, the recent searches, the rows, the arrow keys, and the ways to run a search or open a page. */
function useSearch(initial, onDone) {
  const [q, setQ] = useState(initial || '');
  const [recent, setRecent] = useState(readRecent);
  const [active, setActive] = useState(-1);
  const search = (text) => {
    const value = text.trim();
    if (!value) return;
    const next = withRecent(recent, value);
    setRecent(next); keepRecent(next);
    onDone();
    go(`/search?q=${encodeURIComponent(value)}`);
  };
  const open = (path) => { onDone(); go(path); };
  const rows = rowsFor(q, recent, search, open);
  useEffect(() => { setActive(-1); }, [q]);
  // the arrows move along the rows (round the ends), Enter runs the row they are on or the search of the text, Escape is for the caller
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % rows.length); } else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i <= 0 ? rows.length - 1 : i - 1)); } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && rows[active]) rows[active].run(); else search(q);
    }
  };
  return { q, setQ, rows, active, setActive, onKeyDown, search };
}

/** A desktop: the field, and under it a dropdown while it has focus. */
function SearchDropdown({ query }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const listId = useId();
  const s = useSearch(query, () => setOpen(false));
  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (!box.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);
  const activeId = open && s.active >= 0 && s.rows[s.active] ? `${listId}-${s.rows[s.active].id}` : undefined;
  return (
    <form className="og-search" role="search" ref={box} onSubmit={(e) => { e.preventDefault(); }}>
      <TextInput
        type="search" size="sm" label="Search" value={s.q} autoComplete="off"
        role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list" aria-activedescendant={activeId}
        onChange={(e) => { s.setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Escape') { if (open) { e.preventDefault(); setOpen(false); } return; } if (!open && e.key === 'ArrowDown') setOpen(true); s.onKeyDown(e); }}
      />
      {open && <div className="og-search__panel"><Suggestions rows={s.rows} active={s.active} listId={listId} onPick={(row) => row.run()} onHover={s.setActive} /></div>}
    </form>
  );
}

/** A phone: a field that looks like the search and opens the screen of the search. */
function SearchScreen({ query, onClose }) {
  const listId = useId();
  const s = useSearch(query, onClose);
  useEffect(() => {
    const key = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    const was = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = was; };
  }, []);
  const activeId = s.active >= 0 && s.rows[s.active] ? `${listId}-${s.rows[s.active].id}` : undefined;
  return (
    <div className="og-searchscreen" role="dialog" aria-modal="true" aria-label="Search">
      <ControlRow size="md" gap={1} className="og-searchscreen__bar">
        <IconButton variant="ghost" size="md" label="Close the search" icon={<Icon name="ArrowLeft" size={24} />} onClick={onClose} />
        <TextInput
          type="search" size="sm" label="Search" value={s.q} autoComplete="off" autoFocus enterKeyHint="search"
          role="combobox" aria-expanded="true" aria-controls={listId} aria-autocomplete="list" aria-activedescendant={activeId}
          onChange={(e) => s.setQ(e.target.value)} onKeyDown={s.onKeyDown}
        />
      </ControlRow>
      <div className="og-searchscreen__body"><Suggestions rows={s.rows} active={-1} listId={listId} onPick={(row) => row.run()} onHover={() => {}} /></div>
    </div>
  );
}

export function Search({ query }) {
  const mobile = useMedia('(max-width: 767px)');
  const [screen, setScreen] = useState(false);
  const opener = useRef(null);
  if (!mobile) return <SearchDropdown query={query} />;
  const close = () => { setScreen(false); opener.current?.querySelector('input')?.blur(); };
  return (
    <div className="og-search" ref={opener}>
      <TextInput type="search" size="sm" label="Search" value={query || ''} readOnly aria-haspopup="dialog" onFocus={() => setScreen(true)} onClick={() => setScreen(true)} onChange={() => {}} />
      {/* in the body, not in the header: the screen covers the bottom bar too, which the stacking of the header would not let it */}
      {screen && createPortal(<SearchScreen query={query} onClose={close} />, document.body)}
    </div>
  );
}
