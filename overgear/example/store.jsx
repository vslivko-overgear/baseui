import { createContext, useContext, useMemo, useCallback } from '../../src/react.js';
import { useStored } from './util.js';
import { SEED_ORDERS } from './data.js';
import { WALLET_START, withTopUp, withCoins } from './wallet-core.js';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);
const initial = () => ({ cart: [], wishlist: ['venomous-abyss-heroic', 'power-leveling'], orders: SEED_ORDERS, user: null, promo: '', wallet: WALLET_START });

/** The shop of this browser: the cart, the wishlist, the orders and the account. It lives in localStorage; nothing leaves the device. */
export function StoreProvider({ children }) {
  const [state, setState] = useStored('baseui-overgear', initial);
  const patch = useCallback((fn) => setState((s) => ({ ...s, ...fn(s) })), [setState]);
  const api = useMemo(() => {
    const total = state.cart.reduce((n, i) => n + i.price * i.qty, 0);
    const discount = state.promo === 'WELCOME10' ? +(total * 0.1).toFixed(2) : 0;
    return {
      ...state,
      // a browser that kept its state before the wallet existed starts with the wallet of a new one
      balance: (state.wallet || WALLET_START).balance,
      coins: (state.wallet || WALLET_START).coins,
      topUp: (amount) => patch((s) => ({ wallet: withTopUp(s.wallet || WALLET_START, amount) })),
      count: state.cart.reduce((n, i) => n + i.qty, 0),
      subtotal: total,
      discount,
      total: +(total - discount).toFixed(2),
      add: (item) => patch((s) => {
        const same = s.cart.find((i) => i.key === item.key);
        return { cart: same ? s.cart.map((i) => (i === same ? { ...i, qty: i.qty + (item.qty || 1) } : i)) : [...s.cart, { qty: 1, ...item }] };
      }),
      setQty: (key, qty) => patch((s) => ({ cart: qty < 1 ? s.cart.filter((i) => i.key !== key) : s.cart.map((i) => (i.key === key ? { ...i, qty } : i)) })),
      remove: (key) => patch((s) => ({ cart: s.cart.filter((i) => i.key !== key) })),
      setPromo: (promo) => patch(() => ({ promo })),
      toggleWish: (id) => patch((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id] })),
      login: (user) => patch(() => ({ user })),
      logout: () => patch(() => ({ user: null })),
      placeOrder: (info) => {
        const order = { id: `OG-${Math.floor(100000 + Math.random() * 899999)}`, date: Date.now(), status: 'Paid', items: state.cart.map((i) => ({ title: i.title, qty: i.qty, price: i.price })), total: info?.total ?? total, discount, info };
        patch((s) => ({ orders: [order, ...s.orders], cart: [], promo: '', wallet: withCoins(s.wallet || WALLET_START, info?.cashback ?? 0) }));
        return order;
      },
      reset: () => setState(initial()),
    };
  }, [state, patch, setState]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
