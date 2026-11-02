import { Breadcrumbs } from '../../src/components/Breadcrumbs.jsx';
import { Page, PageHead, Section } from './ui.jsx';
import { Faq } from './games.jsx';

const PAGES = {
  about: ['About us', 'Overgear is a marketplace for game services. We connect players with verified pros and keep the money safe until the work is done'],
  guarantees: ['Guarantees', 'Every order is covered: a refund if it is not started or not completed as described, a replacement booster if the first one cannot finish, and 24/7 human support'],
  help: ['Get help', 'Find an answer below, or write to support from the order chat'],
  contact: ['Contact us', 'Write to support@example.com or use the chat in your order. We answer within one hour'],
  terms: ['Terms of service', 'These are example terms for a demo. The real service has its own'],
  privacy: ['Privacy policy', 'This demo keeps everything in your browser. Nothing is sent anywhere'],
  refund: ['Refund policy', 'An order that is not started is refunded in full. A finished order is final'],
  careers: ['Work with us', 'We are hiring PRO players to join our elite team. This is a demo page, so there is no application form here'],
  guides: ['Guides', 'Guides for players are not part of this demo'],
  consent: ['Consent Preferences', 'This demo uses local storage for the cart and the theme only'],
  credential: ['Credential on File Agreement', 'This is an example page. The real agreement is on the Overgear site'],
  cookies: ['Cookie policy', 'This demo uses local storage for the cart and the theme only'],
};
export function Info({ id }) {
  const [title, text] = PAGES[id] || PAGES.about;
  return (
    <Page>
      <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: title }]} title={title}><p className="og-text" style={{ maxWidth: '70ch' }}>{text}</p></PageHead>
      {id === 'help' && <Section title="Questions"><Faq /></Section>}
    </Page>
  );
}
