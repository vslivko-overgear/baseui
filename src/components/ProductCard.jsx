import { cx, useState } from '../react.js';
import { describe } from '../doc.js';
import { ClickableCard } from './Card.jsx';
import { Badge } from './Badge.jsx';
import { Icon } from './Icon.jsx';
import { IconButton } from './Button.jsx';

/** The heart over the picture of a card: a button of its own (it sits next to the card, not inside it), with a short move when it is tapped. */
function FavoriteButton({ favorite }) {
  const { active = false, onToggle, label } = favorite;
  const [move, setMove] = useState('');
  const text = label ?? (active ? 'Remove from favorites' : 'Add to favorites');
  return (
    <span data-slot="product-card-favorite" className="bui-product-card__favorite">
      <IconButton
        variant="ghost"
        size="xsm"
        label={text}
        tooltip={false}
        icon={
          <span className={cx('bui-product-card__heart', move && `is-${move}`)} onAnimationEnd={() => setMove('')}>
            <Icon name="Heart" size={24} filled={active} />
          </span>
        }
        onClick={(e) => {
          e.stopPropagation();
          setMove(active ? 'off' : 'on');
          onToggle?.(!active);
        }}
      />
    </span>
  );
}

/**
 * The card of a product in a listing: a picture with a badge and a heart over it, an optional line above the price (the game), the price, the title in two lines, the rating and one line of meta.
 * It is the one card of a listing: use it inside ProductListing, which lays the cards in whole rows.
 */
export function ProductCard({ title, price, image, imageAlt = '', fallbackIcon = 'Image01', badge, badgeVariant = 'secondary', eyebrow, rating, meta, favorite, onClick, href, label, className, ...rest }) {
  return (
    <div data-slot="product-card" className={cx('bui-product-card', className)} {...rest}>
      <ClickableCard label={label ?? title} variant="surface" padding={2} onClick={onClick} href={href}>
        <span className="bui-product-card__inner">
          <span className="bui-product-card__art">
            {image ? <img src={image} alt={imageAlt} loading="lazy" /> : <Icon name={fallbackIcon} size={32} />}
            {badge && (
              <span className="bui-product-card__badge">
                <Badge variant={badgeVariant} size="sm" label={badge} />
              </span>
            )}
          </span>
          <span className="bui-product-card__body" data-spacing-ignore="">
            {eyebrow && <span className="bui-product-card__eyebrow">{eyebrow}</span>}
            <span className="bui-product-card__price">{price}</span>
            <span className="bui-product-card__title">{title}</span>
            {(rating != null || meta) && (
              <span className="bui-product-card__meta">
                {rating != null ? (
                  <span className="bui-product-card__rating">
                    <Icon name="Star01" size={16} filled />
                    {Number(rating).toFixed(1)}
                  </span>
                ) : (
                  <span />
                )}
                {meta && <span className="bui-product-card__sub">{meta}</span>}
              </span>
            )}
          </span>
        </span>
      </ClickableCard>
      {favorite && <FavoriteButton favorite={favorite} />}
    </div>
  );
}

describe(ProductCard, 'The card of a product in a listing: a picture with a badge and a heart over it, the price, the title in two lines, the rating and one line of meta (for example how many were sold)', {
  title: ['string', null, 'Name of the product, two lines at most'],
  price: ['ReactNode', null, 'Price, in bold'],
  image: ['string', null, 'Picture url; it fills the 4:5 area. Without it the fallback icon is shown'],
  imageAlt: ['string', "''", 'Alternative text of the picture (empty when the title says the same)'],
  fallbackIcon: ['string', "'Image01'", 'Icon of the catalog shown when there is no picture'],
  badge: ['string', null, 'A mark over the top left corner of the picture: Sale, Hot offer'],
  badgeVariant: ["'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'", "'secondary'", 'Color of the badge'],
  eyebrow: ['ReactNode', null, 'A line above the price in 12px Secondary: the game or the category the product belongs to'],
  rating: ['number', null, 'Rating, shown with a star'],
  meta: ['ReactNode', null, 'The line on the right of the rating: sold, delivery time'],
  favorite: ['{ active?: boolean, onToggle?: (active: boolean) => void, label?: string }', null, 'The heart over the top right corner of the picture: filled when active; tapping it plays a short move'],
  onClick: ['() => void', null, 'Opens the product'],
  href: ['string', null, 'Opens the product as a link'],
  label: ['string', null, 'Accessible name of the card (the title by default)'],
});
