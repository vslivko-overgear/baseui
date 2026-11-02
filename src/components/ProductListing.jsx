import { cx, useState, useRef, useEffect } from '../react.js';
import { describe } from '../doc.js';
import { Bleed } from './Layout.jsx';
import { Button } from './Button.jsx';
import { Skeleton } from './Skeleton.jsx';
import { Pagination } from './Pagination.jsx';
import { ProductCard } from './ProductCard.jsx';

/** The number of columns of a grid (the ref goes on the grid): a listing ends a row when its cards are a multiple of it. */
export function useColumns(initial = 2) {
  const ref = useRef(null);
  const [cols, setCols] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const read = () => setCols(Math.max(1, getComputedStyle(el).gridTemplateColumns.split(' ').length));
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, cols];
}

/**
 * A listing of products: the cards take the whole width of a row, and the listing always shows whole rows. What comes after the first rows is a setting:
 * "Show more" (the default), an endless scroll, or pagination.
 */
export function ProductListing({
  items,
  renderItem,
  more = 'button',
  rows = 2,
  hasMore = false,
  onLoadMore,
  loading = false,
  page: pageProp,
  onPageChange,
  moreLabel = 'Show more',
  label = 'Products',
  className,
  ...rest
}) {
  const [gridRef, cols] = useColumns();
  const per = cols * rows;
  const [shownRows, setShownRows] = useState(rows);   // counted in rows, so the first screen does not depend on the columns it was measured with
  const [pageState, setPageState] = useState(1);
  const page = pageProp ?? pageState;
  const sentinel = useRef(null);
  const draw = (item, i) => {
    if (renderItem) return renderItem(item, i);
    const { id, ...card } = item;
    return <ProductCard {...card} />;
  };

  // whole rows: while more may come, the cards that would start a new row wait for the rest of it
  const whole = hasMore ? Math.floor(items.length / cols) * cols : items.length;
  const wanted = shownRows * cols;
  const shownCount = more === 'pagination' ? 0 : Math.min(wanted, whole);
  const pages = Math.max(1, Math.ceil(items.length / per));
  const list = more === 'pagination' ? items.slice((page - 1) * per, page * per) : items.slice(0, shownCount);
  const hidden = more !== 'pagination' && (shownCount < items.length || hasMore);

  const showMore = () => {
    setShownRows((r) => r + rows);
    if (wanted + per > whole && hasMore) onLoadMore?.();
  };
  // an endless scroll: the end of the listing coming into view shows the next rows
  useEffect(() => {
    if (more !== 'infinite' || !hidden || loading || typeof IntersectionObserver === 'undefined') return undefined;
    const el = sentinel.current;
    if (!el) return undefined;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && showMore(), { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  });

  const skeletons = loading ? per : 0;
  return (
    <div data-slot="product-listing" data-more={more} data-has-more={hidden || undefined} className={cx('bui-listing-wrap', className)} {...rest}>
      <Bleed className="bui-listing">
        <div ref={gridRef} role="list" aria-label={label} aria-busy={loading || undefined} className="bui-listing__grid">
          {list.map((item, i) => (
            <div role="listitem" key={item.id ?? i} className="bui-listing__item">
              {draw(item, i)}
            </div>
          ))}
          {Array.from({ length: skeletons }, (_, i) => (
            <Skeleton key={`s${i}`} variant="rect" height="auto" className="bui-listing__skeleton" />
          ))}
        </div>
      </Bleed>
      {more === 'button' && hidden && (
        <Button variant="secondary" size="lg" textSize={16} width="100%" label={moreLabel} disabled={loading} loading={loading} onClick={showMore} />
      )}
      {more === 'infinite' && hidden && <div ref={sentinel} data-slot="product-listing-end" className="bui-listing__end" aria-hidden="true" />}
      {more === 'pagination' && pages > 1 && <Pagination page={page} total={pages} onPageChange={(p) => { setPageState(p); onPageChange?.(p); }} />}
    </div>
  );
}

describe(ProductListing, 'A listing of products: the cards take the whole width of a row and the listing always shows whole rows. After the first rows come a "Show more" button (the default), an endless scroll or pagination, by setting', {
  items: ['Array<object>', null, 'The products: the props of a ProductCard (or what `renderItem` takes); an `id` is the key'],
  renderItem: ['(item, index) => ReactNode', null, 'Draws a card; by default a ProductCard with the props of the item'],
  more: ["'button' | 'infinite' | 'pagination'", "'button'", 'What comes after the first rows: a Show more button (the default), an endless scroll, or pagination. Choose the mode that fits the product'],
  rows: ['number', '2', 'How many rows are shown at first, and how many come at a time'],
  hasMore: ['boolean', 'false', 'More products can be loaded: with `onLoadMore`, and until they come the cards that would start a new row wait'],
  onLoadMore: ['() => void', null, 'Called when the listing needs more products than it has'],
  loading: ['boolean', 'false', 'Loading: skeletons of the next rows are shown, and the button waits'],
  page: ['number', null, 'Pagination: the current page'],
  onPageChange: ['(page: number) => void', null, 'Pagination: called with the new page'],
  moreLabel: ['string', "'Show more'", 'The label of the button'],
  label: ['string', "'Products'", 'Accessible name of the list'],
});
