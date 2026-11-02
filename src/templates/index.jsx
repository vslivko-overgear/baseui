// The template components by id. The metadata (title, category, the components used) is in registry.js.
import * as dashboards from './dashboard.jsx';
import * as table from './table.jsx';
import * as form from './form.jsx';
import * as settings from './settings.jsx';
import * as login from './login.jsx';
import * as tools from './tools.jsx';
import * as content from './content.jsx';
import * as chat from './ai-chat.jsx';
import * as gallery from './gallery.jsx';
import * as shell from './shell.jsx';

export const TEMPLATE_COMPONENTS = {
  'analytics-dashboard': dashboards.AnalyticsDashboard,
  'data-dashboard': dashboards.DataDashboard,
  'executive-summary-dashboard': dashboards.ExecutiveSummaryDashboard,
  'funnel-cohort-dashboard': dashboards.FunnelCohortDashboard,
  'portfolio-dashboard': dashboards.PortfolioDashboard,
  'project-status-dashboard': dashboards.ProjectStatusDashboard,
  'service-monitoring-dashboard': dashboards.ServiceMonitoringDashboard,
  'searchable-table': table.SearchableTable,
  'filterable-table': table.FilterableTable,
  'grouped-table': table.GroupedTable,
  'collapsible-table': table.CollapsibleTable,
  'inbox-table': table.InboxTable,
  'comparison-table': table.ComparisonTable,
  'contact-form': form.ContactForm,
  'two-column-form': form.TwoColumnForm,
  'checkout-form': form.CheckoutForm,
  'checkout-wizard': form.CheckoutWizard,
  'form-wizard': form.FormWizard,
  'vertical-wizard': form.VerticalWizard,
  'inline-wizard': form.InlineWizard,
  'dialog-wizard': form.DialogWizard,
  'settings-form': settings.SettingsForm,
  'settings-panels': settings.SettingsPanels,
  'settings-dialog': settings.SettingsDialog,
  'login-card': login.LoginCard,
  'login-split': login.LoginSplit,
  'login-sso': login.LoginSso,
  'kanban-board': tools.KanbanBoard,
  'file-explorer': tools.FileExplorer,
  'centered-hero': content.CenteredHero,
  'gallery-hero': content.GalleryHero,
  'documentation-catalog': content.DocumentationCatalog,
  'documentation-design': content.DocumentationDesign,
  'documentation-technical': content.DocumentationTechnical,
  'order-detail': content.OrderDetail,
  'product-detail': content.ProductDetail,
  'work-item-detail': content.WorkItemDetail,
  'ai-chat-conversation': chat.AiChatConversation,
  'ai-chat-landing': chat.AiChatLanding,
  'card-grid': gallery.CardGrid,
  'classic-gallery': gallery.ClassicGallery,
  'mixed-gallery': gallery.MixedGallery,
  'product-gallery': gallery.ProductGallery,
  'side-gallery': gallery.SideGallery,
  'top-nav': shell.TopNav,
  'side-nav': shell.SideNavShell,
  'shell-nav': shell.ShellNav,
};
