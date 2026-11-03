// The ranks of a buyer, with the rules of the real service (og-frontend-4: the Bonuses tab of the profile, the rank in the menu of the profile): the ranks (grades), how a rank is earned (the spending of the last
// 365 days), the way to the next one, the perks of a rank, and the history of the rank. Pure functions; rank.jsx draws them.
// The ranks themselves (names, thresholds, perks) come from the backend of the real service; the ones here are the example's.

/** The ranks, from the lowest. `paidUsd`: what has to be spent in the last 365 days to have the rank. The perks are the five of the benefits table of the real service. */
export const GRADES = [
  { level: 1, code: 'shield', name: 'Shield', paidUsd: 0, cashbackPercentage: 1, purchaseLimitPercentage: 15, customizableBundles: false, keepConversationWithBooster: false, priorityOrderFulfillment: 0, color: '#9aa3b2' },
  { level: 2, code: 'knight', name: 'Knight', paidUsd: 250, cashbackPercentage: 1.5, purchaseLimitPercentage: 20, customizableBundles: false, keepConversationWithBooster: true, priorityOrderFulfillment: 0, color: '#4ea1ff' },
  { level: 3, code: 'champion', name: 'Champion', paidUsd: 1000, cashbackPercentage: 2, purchaseLimitPercentage: 25, customizableBundles: true, keepConversationWithBooster: true, priorityOrderFulfillment: 1, color: '#b574ff' },
  { level: 4, code: 'warlord', name: 'Warlord', paidUsd: 3000, cashbackPercentage: 2.5, purchaseLimitPercentage: 30, customizableBundles: true, keepConversationWithBooster: true, priorityOrderFulfillment: 2, color: '#ff9f43' },
  { level: 5, code: 'legend', name: 'Legend', paidUsd: 10000, cashbackPercentage: 3, purchaseLimitPercentage: 35, customizableBundles: true, keepConversationWithBooster: true, priorityOrderFulfillment: 3, color: '#ffd24a' },
];

const DAY = 864e5;
export const YEAR = 365 * DAY;

/** The orders that count for a rank: completed ones (completed, or resolved for the seller), in the last 365 days. */
const COUNTS = ['status/COMPLETED', 'status/RESOLVED'];
const dateOf = (o) => o.completedAt ?? o.createdAt;
export const spentLastYear = (orders, now) => +orders.filter((o) => COUNTS.includes(o.status) && now - dateOf(o) <= YEAR && now >= dateOf(o)).reduce((sum, o) => sum + (o.price || 0), 0).toFixed(2);

/** The rank that `paid` dollars spent in the last 365 days give: the highest one whose threshold is reached. */
export const gradeFor = (paid, grades = GRADES) => grades.filter((g) => g.paidUsd <= paid).at(-1) || grades[0];
export const nextGrade = (grade, grades = GRADES) => grades.find((g) => g.level === grade.level + 1) || null;
export const maxGrade = (grades = GRADES) => grades.reduce((a, g) => (a.level < g.level ? g : a));

/** The way to the next rank: what is left to spend and how far the bar goes (the real service's: 100 - left / the threshold of the next rank * 100). The top rank has no way. */
export const progressTo = (paid, grade, grades = GRADES) => {
  const next = nextGrade(grade, grades);
  if (!next) return { next: null, left: 0, percentage: 100, isMax: true };
  const left = Math.max(+(next.paidUsd - paid).toFixed(2), 0);
  return { next, left, percentage: Math.min(Math.max(100 - (left / next.paidUsd) * 100, 0), 100), isMax: false };
};

/** The rows of the table of perks: the name, a hint, and for the rank now and the next one the value. A value is a percent, or a yes/no. */
export const BENEFITS = [
  { uid: 'cashback', name: 'Cashback', kind: 'percent', of: (g) => g.cashbackPercentage },
  { uid: 'points', name: 'Points Redemption', kind: 'percent', hint: 'Limit the maximum percentage of a purchase that can be paid using accumulated loyalty points', of: (g) => g.purchaseLimitPercentage },
  { uid: 'bundles', name: 'Customizable Bundles', kind: 'flag', of: (g) => g.customizableBundles },
  { uid: 'conversation', name: 'Save Sessions with Booster', kind: 'flag', of: (g) => g.keepConversationWithBooster },
  { uid: 'priority', name: 'Priority Order Fulfillment', kind: 'flag', of: (g) => g.priorityOrderFulfillment > 0 },
];
/** The value of a perk for a rank, as a text for a percent (`1.5%`) or a boolean for a flag. */
export const benefitValue = (benefit, grade) => (benefit.kind === 'percent' ? `${benefit.of(grade)}%` : !!benefit.of(grade));

/**
 * The history of the rank of a buyer: when each rank began. The spending is the rolling 365 days after each completed order, so a rank can also fall back when old orders leave the year.
 * [{ createdDate, grade }], the newest first; it starts with the first rank on the day of the first order.
 */
export const rankHistory = (orders, now, grades = GRADES) => {
  const done = orders.filter((o) => COUNTS.includes(o.status) && dateOf(o) <= now).sort((a, b) => dateOf(a) - dateOf(b));
  if (!done.length) return [];
  const events = [];
  let last = null;
  const points = [...new Set([...done.map(dateOf), ...done.map((o) => dateOf(o) + YEAR + 1)])].filter((t) => t <= now).sort((a, b) => a - b);
  for (const t of points) {
    const grade = gradeFor(spentLastYear(done, t), grades);
    if (!last || grade.level !== last.level) { events.push({ createdDate: t, grade }); last = grade; }
  }
  return events.reverse();
};

/** What the person reads about their rank on the account line: "Rank: Knight". */
export const rankLine = (grade) => `Rank: ${grade.name}`;
