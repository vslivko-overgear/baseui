// The page of one order of a buyer (/order/:link), as the real service has it (order-page-widget): the title and the number, the steps of the order, the status (its words by the status, the time left, the buttons of the
// buyer), the delivery details the seller needs, the review and the tips once it is done, the Discord panel, the info of the order and the chat. On a phone the status and the chat are two tabs.
// The rules (what each status says, which buttons it has, the locks and the timers, what happens next) are in order-core.js; this file draws them and keeps the choices of the buyer.
// "What happens next" at the bottom is for the demo: it plays the seller, the time and the support, which the real service does by itself.
import { useEffect, useState } from '../../src/react.js';
import { Button, IconButton } from '../../src/components/Button.jsx';
import { ButtonGroup } from '../../src/components/ButtonGroup.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Checkbox } from '../../src/components/Checkbox.jsx';
import { Dialog } from '../../src/components/Dialog.jsx';
import { Form, FormSection } from '../../src/components/Form.jsx';
import { Hint } from '../../src/components/Hint.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { ProgressBar } from '../../src/components/ProgressBar.jsx';
import { Rating, RatingDisplay } from '../../src/components/Rating.jsx';
import { SegmentedControl } from '../../src/components/SegmentedControl.jsx';
import { Status } from '../../src/components/Status.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { go, href, useMedia } from './util.js';
import { money, gameOf } from './data.js';
import { Page, PageHead } from './ui.jsx';
import { useStore } from './store.jsx';
import { reorderPath } from './orders.jsx';
import {
  ORDER_STATUS as S, statusLabel, statusBadge, statusText, panelTone, stepLooks, progressTone, buyerActions, isPaused, isClosed, isKYC, timeLeft, leftText, isDelayed, autoCompleteAt, tipsOpen, showReview,
  showJoinPanel, hasUnfilledDelivery, deliveryErrors, fillDelivery, MIN_REVIEW, MAX_REVIEW, reviewError, reviewReady, askTrustpilot, addReview, addTip, confirmDelivery, cancelOrder, openDispute, confirmLockLeft,
  nextEvents, applyEvent, cardDate,
} from './order-core.js';
import { Badge } from '../../src/components/Badge.jsx';

/** The clock of the page: now, every second. */
function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(id); }, [ms]);
  return now;
}
const dateTime = (t) => new Date(t).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

// ---- the steps ----

/** The timeline of the order: a segment for each step, filled as far as the step is done, in the color of the state of the order. */
/** The look of a step by its state: passed is a dimmed (disabled) white bar with a check at its text, the current stage is green, the stage where the work goes on is a full green bar with a soft light moving over it, the stage with a problem is yellow, the rest is empty. */
const STEP_BAR = { done: { color: 'success', value: 100 }, current: { color: 'success', value: 100 }, run: { color: 'success', value: 100 }, problem: { color: 'warning', value: 100 }, todo: { color: 'success', value: 0 } };

function Steps({ order, now }) {
  const line = stepLooks(order, now);
  if (!line) return null;
  if (line.kind === 'bar') return <ProgressBar size="sm" color={line.tone} value={100} aria-label="Order progress" data-test-id="order-steps" />;
  const { steps, current } = line;
  return (
    <ol className="og-osteps" aria-label="Order progress" data-test-id="order-steps" style={{ '--steps': steps.length }}>
      {steps.map((s) => (
        <li key={s.name} className="og-osteps__step" data-active={s.active || undefined} data-look={s.look} aria-current={s.name === current ? 'step' : undefined} data-test-id={`order-step-${s.name}`}>
          <ProgressBar size="sm" color={STEP_BAR[s.look].color} value={STEP_BAR[s.look].value} aria-label={s.title} />
          <span className="og-osteps__title">{s.look === 'done' && <Icon name="Check" size={14} />}{s.title}</span>
        </li>
      ))}
    </ol>
  );
}

// ---- the status ----

/** The status of the order for the buyer: its title and words, the time left, the buttons. */
function StatusPanel({ order, now, actions }) {
  const { title, description } = statusText(order, now);
  const tone = panelTone(order, now);
  const paused = isPaused(order.status, order.state);
  const left = timeLeft(order, now);
  const late = isDelayed(order, now);
  const showTime = [S.IN_PROGRESS, S.KYC_WATCH, S.ORDER_PAUSED_IN_PROGRESS].includes(order.status) && left != null;
  const waiting = order.status === S.CONFIRM_DELIVERY;
  return (
    <Card variant="surface" padding={0} className="og-ostatus" data-tone={tone} data-test-id="order-status" data-status={order.status}>
      <div className="og-ostatus__head og-stack og-stack--lg">
        <div className="og-stack og-stack--close">
          <h2 className="og-h3" data-test-id="order-status-title">{title}</h2>
          <p className="og-ostatus__text" data-test-id="order-status-text">{description}</p>
        </div>
        {showTime && (
          <p className="og-ostatus__time" data-test-id="order-time">
            <Icon name="Clock" size={20} />
            <span>{paused ? 'The time of the order is paused' : late ? 'The time is over' : `${leftText(left)} left`}</span>
            {paused && <Hint label="About the pause" content={order.status === S.KYC_WATCH ? 'The completion time (ETA) of your order is on hold while we investigate some suspicious activity. We appreciate your patience: we will deliver your order promptly once the checks are done' : 'The completion time (ETA) has been paused until the verification is complete'} />}
          </p>
        )}
        {waiting && (
          <p className="og-ostatus__note" data-test-id="order-auto-complete">
            <strong>Please keep in mind if you don’t confirm delivery in 72 hours order will change status to Completed automatically</strong>
            <br />{`Order status will be changed to Completed: ${dateTime(autoCompleteAt(order))}`}
          </p>
        )}
      </div>
      {actions.length > 0 && (
        <div className="og-ostatus__foot">
          <ButtonGroup orientation="horizontal" stackOnMobile>
            {actions.map((a) => <Button key={a.id} variant={a.variant} size="lg" label={a.label} disabled={a.disabled} onClick={a.run} data-test-id={`order-action-${a.id}`} />)}
          </ButtonGroup>
          {actions.filter((a) => a.hint).map((a) => <p key={a.id} className="og-meta" data-test-id={`order-action-${a.id}-note`}>{a.hint}</p>)}
        </div>
      )}
    </Card>
  );
}

// ---- the delivery details ----

/** What the seller needs from the buyer: a form while it is not filled (the order cannot start without it), then the list of what was given. */
function DeliveryDetails({ order, onSave }) {
  const [values, setValues] = useState(order.delivery.values || {});
  const [errors, setErrors] = useState({});
  const [shown, setShown] = useState(false);
  const { fields } = order.delivery;
  const unfilled = hasUnfilledDelivery(order);
  const done = isClosed(order.status);
  const submit = (e) => {
    e.preventDefault();
    const bad = deliveryErrors(fields, values);
    setErrors(bad);
    if (!Object.keys(bad).length) onSave(values);
  };
  if (unfilled) {
    return (
      <Card variant="surface" padding={5} data-test-id="order-delivery-form">
        <Form onSubmit={submit} noValidate>
          <FormSection title="Fill Delivery Details" titleAs="h2">
            <p className="og-text">Please provide your delivery details—we can’t start your order until they’re submitted. Rest assured, your information is safe and private with us. Please note, after submission any changes can be made through manager</p>
            {fields.map((f) => (
              <TextInput key={f.key} label={f.label} type={f.secret ? 'password' : 'text'} value={values[f.key] || ''} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} status={errors[f.key] ? 'error' : undefined} caption={errors[f.key] || f.note} autoComplete="off" />
            ))}
            <Button type="submit" variant="primary" size="lg" label="Submit Details" data-test-id="order-delivery-submit" />
          </FormSection>
        </Form>
      </Card>
    );
  }
  return (
    <Card variant="surface" padding={5} data-test-id="order-delivery-details">
      <div className="og-stack">
        <h2 className="og-h3">Delivery details</h2>
        <List aria-label="Delivery details">
          {fields.map((f) => {
            const secret = f.secret;
            const text = secret ? (done ? 'Removed' : shown ? order.delivery.values[f.key] : '••••••••') : order.delivery.values[f.key];
            return (
              <ListItem key={f.key} overline={f.label} details={secret && !done ? <IconButton variant="ghost" size="xsm" label={shown ? 'Hide the password' : 'Show the password'} icon={<Icon name={shown ? 'EyeOff' : 'Eye'} size={20} />} onClick={() => setShown(!shown)} /> : undefined}>{text}</ListItem>
            );
          })}
        </List>
        <p className="og-text">{done && fields.some((f) => f.secret) ? 'Order completed. Your password has been securely removed' : 'If you’d like to change this, please contact the seller in the chat window and provide the new delivery details'}</p>
      </div>
    </Card>
  );
}

// ---- the review and the tips ----

function ReviewModal({ open, onOpenChange, existing, onSubmit }) {
  const [rate, setRate] = useState(existing?.rate || 0);
  const [text, setText] = useState(existing?.text || '');
  useEffect(() => { if (open) { setRate(existing?.rate || 0); setText(existing?.text || ''); } }, [open]);
  const error = reviewError(text);
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={existing ? 'Update your review' : 'Rate your order'} primaryAction={<Button variant="primary" size="lg" width="100%" label={existing ? 'Update review' : 'Submit your review'} disabled={!reviewReady(rate, text)} onClick={() => onSubmit(rate, text)} data-test-id="order-review-submit" />}>
      <div className="og-stack">
        <Rating label="Your rate" value={rate} onValueChange={setRate} size="lg" />
        <TextInput multiline minRows={4} label="Your review" value={text} onChange={(e) => setText(e.target.value)} status={error ? 'error' : undefined} caption={error || `${MIN_REVIEW} to ${MAX_REVIEW} characters, you can leave it empty`} data-test-id="order-review-text" />
      </div>
    </Dialog>
  );
}

function TrustpilotModal({ open, onOpenChange, text }) {
  const { toast } = useToast();
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Awesome! Help others discover us!" secondaryAction={<Button variant="secondary" size="lg" width="100%" label="Copy your review" onClick={() => { navigator.clipboard?.writeText(text); toast({ message: 'Review copied!', status: 'success' }); }} />} primaryAction={<Button variant="primary" size="lg" width="100%" label="Rate us on Trustpilot" icon={<Icon name="LinkExternal01" size={20} />} onClick={() => { toast({ message: 'Trustpilot opens here (a demo)' }); onOpenChange(false); }} />}>
      <p className="og-text">Share your review on Trustpilot to let more people know about our service. Your opinion matters and helps us build trust in our brand!</p>
    </Dialog>
  );
}

const TIPS = [1, 3, 5, 10];
function TipsModal({ open, onOpenChange, onTip }) {
  const [amount, setAmount] = useState(3);
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Leave Tips" primaryAction={<Button variant="primary" size="lg" width="100%" label={`Send ${money(amount)}`} onClick={() => onTip(amount)} data-test-id="order-tip-send" />}>
      <div className="og-stack">
        <p className="og-text">Thank the booster. He will be grateful</p>
        <SegmentedControl label="Tip amount" fullWidth value={String(amount)} onValueChange={(v) => setAmount(+v)} items={TIPS.map((t) => ({ value: String(t), label: money(t) }))} />
      </div>
    </Dialog>
  );
}

/** The review and the tips, once the order is done: ask for a review, then show it; the tips are open for 72 hours. */
function ReviewAndTips({ order, now, onReview, onTip }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [trust, setTrust] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const open = tipsOpen(order, now);
  const submit = (rate, text) => { onReview(rate, text); setReviewOpen(false); if (askTrustpilot(rate)) setTrust(true); };
  return (
    <>
      <Card variant="surface" padding={5} data-test-id="order-review">
        {order.review ? (
          <div className="og-stack">
            <h2 className="og-h3">Your review</h2>
            <RatingDisplay value={order.review.rate} size="md" />
            {order.review.text && <p className="og-text" data-test-id="order-review-shown">{order.review.text}</p>}
            <Button variant="secondary" size="lg" label="Update review" onClick={() => setReviewOpen(true)} />
          </div>
        ) : (
          <div className="og-stack">
            <div className="og-stack og-stack--close">
              <h2 className="og-h3">How was your order?</h2>
              <p className="og-text">Tell the community how it went. One honest review can carry a lot</p>
            </div>
            <Button variant="primary" size="lg" label="Rate this order" onClick={() => setReviewOpen(true)} data-test-id="order-rate" />
          </div>
        )}
      </Card>
      <Card variant="surface" padding={5} data-test-id="order-tips">
        <div className="og-stack">
          <div className="og-stack og-stack--close">
            <h2 className="og-h3">Did you enjoy the experience?</h2>
            <p className="og-text">{open || order.tip ? 'Thank the booster. He will be grateful. The tipping option will be available for 72 hours after completing the order' : 'Complete your order to thank the booster'}</p>
          </div>
          <Button variant="secondary" size="lg" label={order.tip ? `Tipped ${money(order.tip)}` : 'Leave Tips'} disabled={!open || !!order.tip} onClick={() => setTipOpen(true)} data-test-id="order-tip" />
        </div>
      </Card>
      <ReviewModal open={reviewOpen} onOpenChange={setReviewOpen} existing={order.review} onSubmit={submit} />
      <TrustpilotModal open={trust} onOpenChange={setTrust} text={order.review?.text || ''} />
      <TipsModal open={tipOpen} onOpenChange={setTipOpen} onTip={(a) => { onTip(a); setTipOpen(false); }} />
    </>
  );
}

// ---- the Discord panel ----

function JoinPanel({ onJoin }) {
  return (
    <Card variant="surface" padding={5} data-test-id="order-join">
      <div className="og-stack">
        <div className="og-stack og-stack--close">
          <h2 className="og-h3">Fast and handy Discord messages</h2>
          <p className="og-text">Please join our completely private Discord server for faster communication, to receive updates on your orders, and get secret deals for our Discord members only!</p>
        </div>
        <Button variant="secondary" size="lg" label="Join Server" icon={<Icon name="LinkExternal01" size={20} />} onClick={onJoin} data-test-id="order-join-button" />
      </div>
    </Card>
  );
}

// ---- the info of the order ----

const METHOD = { card: 'Card', apple: 'Apple Pay', google: 'Google Pay', klarna: 'Klarna', neteller: 'Neteller', paypal: 'PayPal', crypto: 'Cryptocurrency', balance: 'Account balance' };
function InfoPanel({ order }) {
  const game = gameOf(order.game)?.name || '';
  const rows = [
    ['Order number', order.link],
    ['Created', dateTime(order.createdAt)],
    ['Game', game],
    ['Price', money(order.price)],
    ['Quantity', String(order.qty)],
    ['Region', order.region],
    ['Delivery method', order.og ? 'Overgear booster' : order.seller?.name],
    ['ETA', leftText(order.duration * 1000)],
    ['Payment method', METHOD[order.method] || 'Card'],
  ].filter(([, v]) => v);
  return (
    <Card variant="surface" padding={5} data-test-id="order-info">
      <div className="og-stack">
        <h2 className="og-h3">Order info</h2>
        <dl className="og-info">{rows.map(([k, v]) => <div key={k} className="og-info__row"><dt className="og-meta">{k}</dt><dd>{v}</dd></div>)}</dl>
      </div>
    </Card>
  );
}

// ---- the chat ----

/** The conversation of the order: the messages and a field. (The real one is the chat with the seller, or with support for an order of the shop.) */
function Conversation({ order, onSend }) {
  const [text, setText] = useState('');
  const who = order.og ? 'Overgear support' : order.seller?.name || 'the seller';
  const send = (e) => { e.preventDefault(); if (!text.trim()) return; onSend(text.trim()); setText(''); };
  const messages = [{ from: 'system', text: 'The order was placed', at: order.createdAt }, ...order.messages];
  return (
    <Card variant="surface" padding={5} data-test-id="order-chat">
      <div className="og-stack">
        <h2 className="og-h3">{`Chat with ${who}`}</h2>
        <ul className="og-chat" aria-label="Messages">
          {messages.map((m, i) => <li key={i} className={`og-chat__msg og-chat__msg--${m.from}`}><span>{m.text}</span><span className="og-meta">{cardDate(m.at)}</span></li>)}
        </ul>
        <form className="og-chat__form" onSubmit={send}>
          <TextInput label="Message" value={text} onChange={(e) => setText(e.target.value)} autoComplete="off" />
          <IconButton type="submit" variant="primary" size="lg" label="Send" icon={<Icon name="Send01" size={24} />} />
        </form>
      </div>
    </Card>
  );
}

// ---- what happens next (the demo) ----

const WHO = { seller: 'Seller', time: 'Time', support: 'Support', system: 'System' };
function Next({ order, now, onEvent }) {
  const events = nextEvents(order, now);
  return (
    <Card variant="surface" padding={5} className="og-next" data-test-id="order-next">
      <div className="og-stack og-stack--close">
        <h2 className="og-h3">What happens next</h2>
        <p className="og-text">A demo: the seller, the time and the support move the order on by themselves. Play them here</p>
      </div>
      {events.length ? (
        <ul className="og-next__list">
          {events.map((e) => (
            <li key={e.id}><Badge variant="secondary" size="sm" label={WHO[e.who]} /><Button variant="secondary" size="md" label={e.label} onClick={() => onEvent(e.id)} data-test-id={`order-event-${e.id}`} /></li>
          ))}
        </ul>
      ) : !hasUnfilledDelivery(order) && <p className="og-meta">Nothing more happens to this order</p>}
      {hasUnfilledDelivery(order) && <p className="og-meta" data-test-id="order-next-wait">The seller starts after you fill in the delivery details</p>}
    </Card>
  );
}

// ---- the dialogs of the buyer ----

function ConfirmDialog({ open, onOpenChange, onConfirm }) {
  const [read, setRead] = useState(false);
  useEffect(() => { if (open) setRead(false); }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Delivery confirmation" primaryAction={<Button variant="primary" size="lg" width="100%" label="Confirm delivery" disabled={!read} onClick={onConfirm} data-test-id="order-confirm-yes" />}>
      <div className="og-stack">
        <p className="og-text">After you press “Confirm Delivery” button the funds will be transferred to the seller, and you will unable to file a claim for this order</p>
        <Checkbox label="I have read the warning and fully aware of the consequences" checked={read} onCheckedChange={setRead} />
      </div>
    </Dialog>
  );
}

function CancelDialog({ open, onOpenChange, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Are you sure you want to cancel order?" primaryAction={<Button variant="primary" size="lg" width="100%" label="No, I'll keep it" onClick={() => onOpenChange(false)} />} secondaryAction={<Button variant="secondary" size="lg" width="100%" label="Yes, I'm sure" onClick={onConfirm} data-test-id="order-cancel-yes" />}>
      <p className="og-text">The order will be cancelled and the money returned to your balance</p>
    </Dialog>
  );
}

function HelpDialog({ open, onOpenChange, onSubmit }) {
  const [text, setText] = useState('');
  useEffect(() => { if (open) setText(''); }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="I need help" primaryAction={<Button variant="primary" size="lg" width="100%" label="Open a dispute" disabled={text.trim().length < MIN_REVIEW} onClick={() => onSubmit(text)} data-test-id="order-help-submit" />}>
      <div className="og-stack">
        <p className="og-text">Tell us what is wrong with the order. Our team will review the case and notify you of the decision as soon as possible</p>
        <TextInput multiline minRows={4} label="What happened" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
    </Dialog>
  );
}

function TicketDialog({ open, onOpenChange, ticket }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Arbitrage ticket" primaryAction={<Button variant="secondary" size="lg" width="100%" label="Close" onClick={() => onOpenChange(false)} />}>
      <div className="og-stack og-stack--close">
        {ticket ? <><p className="og-text">{ticket.text}</p><p className="og-meta">{`Opened ${dateTime(ticket.at)}`}</p></> : <p className="og-meta">There is no ticket for this order</p>}
      </div>
    </Dialog>
  );
}

// ---- the page ----

export function OrderPage({ link, onLogin }) {
  const store = useStore();
  const { toast } = useToast();
  const mobile = useMedia('(max-width: 767px)');
  const now = useNow();
  const [tab, setTab] = useState('status');
  const [dialog, setDialog] = useState('');
  const order = store.orders.find((o) => o.link === link);

  if (!store.user && !store.temp) return <Page fill><Status status="neutral" icon={<Icon name="ShoppingBag01" size={28} />} title="Sign in to see this order" description="Your orders are kept in your account" actionLabel="Sign in" onAction={onLogin} /></Page>;
  if (!order) return <Page fill><Status status="neutral" title="Order not found" description="There is no such order in your account" actionLabel="My orders" onAction={() => go('/orders')} /></Page>;

  const update = (change) => store.updateOrder(order.link, change);
  const run = {
    confirm: () => setDialog('confirm'),
    ticket: () => setDialog('ticket'),
    repeat: () => go(reorderPath(order)),
    help: () => setDialog('help'),
    cancel: () => setDialog('cancel'),
    similar: () => go(`/games/${order.game || 'wow'}`),
  };
  const actions = buyerActions(order, now).map((a) => ({ ...a, run: run[a.id] }));
  const close = () => setDialog('');
  const kyc = isKYC(order.status);

  const left = (
    <>
      <StatusPanel order={order} now={now} actions={actions} />
      {kyc && order.status === S.KYC_LOCK && <p className="og-text" data-test-id="order-kyc">The seller waits for your identity verification. The real service opens the verification page here</p>}
      {order.delivery && <DeliveryDetails key={order.delivery.filled ? 'filled' : 'form'} order={order} onSave={(values) => { update(fillDelivery(order, values)); toast({ message: 'Delivery details saved', status: 'success' }); }} />}
      {showReview(order) && <ReviewAndTips order={order} now={now} onReview={(rate, text) => { update(addReview(order, rate, text, Date.now())); toast({ message: 'Thank you for your review', status: 'success' }); }} onTip={(a) => { update(addTip(order, a)); toast({ message: `Tip sent: ${money(a)}`, status: 'success' }); }} />}
      {showJoinPanel(store.discord, order) && <JoinPanel onJoin={() => { store.joinDiscord(); toast({ message: 'You joined the Discord server (a demo: nothing was opened)', status: 'success' }); }} />}
    </>
  );
  const chat = <Conversation order={order} onSend={(text) => update({ messages: [...order.messages, { from: 'me', text, at: Date.now() }] })} />;

  return (
    <Page bar>
      <div className="og-stack og-stack--xl" data-test-id="order-page" data-status={order.status}>
        <PageHead
          crumbs={[{ label: 'Home', href: href('/') }, { label: 'My orders', href: href('/orders') }, { label: order.title }]}
          title={order.title}
          titleTestId="order-title"
          titleGap="var(--baseui-spacing-2)"
          media={<div className="og-art og-art--square" role="img" aria-label={order.title}>{order.image ? <img className="og-art__img" src={order.image} alt="" /> : <Icon name="Image01" size={32} />}</div>}
        >
          <div className="og-row og-row--wrap">
            <Badge variant={statusBadge(order.status)} size="md" label={statusLabel(order.status)} data-test-id="order-badge" />
            <span className="og-meta" data-test-id="order-meta">{`Order ID ${order.link} · Created ${dateTime(order.createdAt)}`}</span>
          </div>
        </PageHead>
        <Steps order={order} now={now} />
        {mobile ? (
          <div className="og-stack">
            <SegmentedControl label="Order sections" fullWidth value={tab} onValueChange={setTab} items={[{ value: 'status', label: 'Status' }, { value: 'chat', label: 'Chat' }]} />
            {tab === 'status' ? <>{left}<InfoPanel order={order} /></> : chat}
          </div>
        ) : (
          <div className="og-order">
            <div className="og-stack">{left}{chat}</div>
            <div className="og-stack"><InfoPanel order={order} /></div>
          </div>
        )}
        <Next order={order} now={now} onEvent={(id) => update((o) => applyEvent(o, id, Date.now()))} />
      </div>
      <ConfirmDialog open={dialog === 'confirm'} onOpenChange={(o) => !o && close()} onConfirm={() => { update(confirmDelivery(order, Date.now())); close(); toast({ message: 'Delivery confirmed', status: 'success' }); }} />
      <CancelDialog open={dialog === 'cancel'} onOpenChange={(o) => !o && close()} onConfirm={() => { update(cancelOrder(order, Date.now())); close(); toast({ message: 'Order canceled', status: 'success' }); }} />
      <HelpDialog open={dialog === 'help'} onOpenChange={(o) => !o && close()} onSubmit={(text) => { update(openDispute(order, Date.now(), text)); close(); toast({ message: 'A dispute is open', status: 'success' }); }} />
      <TicketDialog open={dialog === 'ticket'} onOpenChange={(o) => !o && close()} ticket={order.ticket} />
    </Page>
  );
}
