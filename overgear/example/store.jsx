import { createContext, useContext, useMemo, useCallback } from '../../src/react.js';
import { useStored } from './util.js';
import { seedOrders } from './order-seed.js';
import { normalizeOrder } from './order-core.js';
import { WALLET_START, withTopUp, withCoins } from './wallet-core.js';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);
const initial = () => ({ cart: [], wishlist: ['venomous-abyss-heroic', 'power-leveling'], orders: seedOrders(Date.now()), user: null, temp: null, discord: false, pending: null, promo: '', wallet: WALLET_START });

/** The shop of this browser: the cart, the wishlist, the orders and the account. It lives in localStorage; nothing leaves the device. */
export function StoreProvider({ children }) {
  const [state, setState] = useStored('baseui-overgear', initial);
  const patch = useCallback((fn) => setState((s) => ({ ...s, ...fn(s) })), [setState]);
  const api = useMemo(() => {
    const total = state.cart.reduce((n, i) => n + i.price * i.qty, 0);
    const discount = state.promo === 'WELCOME10' ? +(total * 0.1).toFixed(2) : 0;
    return {
      ...state,
      // a browser that kept its orders in an older shape gets them in this one
      orders: (state.orders || []).map((o, i) => normalizeOrder(o, i * 7919)),
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
      // a payment makes the orders (see ordersFromCart); a buyer who is not signed in becomes a temporary (guest) account: it has the page of each of its orders but no history
      placeOrders: (orders, info) => {
        patch((s) => ({ orders: [...orders, ...(s.orders || [])], cart: [], promo: '', temp: s.user ? s.temp : { email: info?.email || '' }, wallet: withCoins(s.wallet || WALLET_START, info?.cashback ?? 0) }));
        return orders;
      },
      updateOrder: (link, change) => patch((s) => ({ orders: s.orders.map((o) => (o.link === link ? (typeof change === 'function' ? change(o) : { ...o, ...change }) : o)) })),
      joinDiscord: () => patch(() => ({ discord: true })),
      // a payment that waits for its provider: the orders it will make once it settles
      setPending: (pending) => patch(() => ({ pending })),
      settlePending: () => patch((s) => (s.pending ? { orders: [...s.pending.orders, ...(s.orders || [])], cart: [], promo: '', pending: null, temp: s.user ? s.temp : { email: s.pending.info?.email || '' }, wallet: withCoins(s.wallet || WALLET_START, s.pending.info?.cashback ?? 0) } : {})),
      reset: () => setState(initial()),
    };
  }, [state, patch, setState]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
