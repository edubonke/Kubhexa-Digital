# Interactive website templates

Six original frontend templates and their demos, added 20 October 2026.

| Template | Industry | Package | Main interactions |
| --- | --- | --- | --- |
| Neighbour | Local services | Start | Service filters, FAQs, validated local enquiry |
| Northline | Professional services | Business | Five navigable views, service categories, sample articles, local enquiry |
| Luma | Beauty and wellness | Bookings | Service/stylist/day/time selection, review and simulated booking |
| Fieldform | Creative portfolio | Showcase | Category filters, accessible project story dialogs, local enquiry |
| Table & Thyme | Food and hospitality | Showcase | Menu/diet filters, dish details, local catering enquiry |
| Morrow | Retail | Shop | Product filters/search/colour, bounded quantities, cart, discount, delivery and simulated checkout |

## Routes and deployment

`/templates/` is the catalogue. `/templates/<id>/` is a preview page, and `/templates/<id>/preview/` is its standalone demo. `static/render.tsx` defines all 15 prerendered pages (home, privacy, catalogue and 12 template routes). `scripts/build-pages.mjs` writes real index files for each nested route, using the case-sensitive repository base path. All existing indexing settings are preserved.

Homepage/catalogue cards use an original code-native illustration and miniature composition, not a screenshot or a preloaded frame. Their links open the real interactive pages. The preview has Desktop (1440), Laptop (1024), Tablet (768), Mobile (390) and Small phone (320) widths. Width changes preserve the same iframe and demo state; Reload remounts it. Existing external project previews retain their normal desktop/mobile tools.

The iframe retains the existing parent-isolation sandbox. Same-host demos have an opaque origin and cannot reach parent DOM or storage. All demo interactions use page memory. No backend, storage, account or payment integration is mounted by these demo components. Real Kubhexa enquiries remain on the homepage, outside the sandbox. Demo forms are disabled until hydration and prevent native submission; inputs are checked locally, then display an explicit simulation confirmation.

The iframe source starts after hydration, with its load handler already attached. This prevents a fast or cached prerendered demo from opening before the handler is ready and leaving a false loading notice. The standalone demo link remains available without JavaScript.

## Content and design

All six businesses, service prices, menu items, products and project stories are fictional. No invented testimonials, certifications or measured client outcomes are included. `TemplateArt.tsx` contains original SVG compositions used in both cards and demos. The sample product and menu art are illustrations, not photographs. Each identity has its own colour tokens, layout, type treatment and content in `template-demos.css`; shared interface patterns are kept accessible and responsive.

The in-demo customiser changes the sample business name and colour direction in memory. These edits are not saved to enquiries or added to URLs; clients supply their real branding later. Site/OS reduced-motion settings are respected by the local demo. Native dialogs support Escape, focus trapping and focus return. Mobile navigation, filters, forms and cart controls are native keyboard-operable elements.

## Enquiry handoff

Template IDs and mappings live in `lib/templates.ts`. The current catalogue covers every published package. A Use-template action from a standalone page returns to `/?template=<known-id>#contact`; the homepage recognises only allowlisted IDs, derives the correct package and family, and includes the template name in the existing saved brief. A manipulated price or package query parameter cannot override catalogue pricing. The homepage gallery also selects templates directly in the existing estimator.

Changing a package or business type clears incompatible template selection. Selecting a custom non-website project clears the website estimate. Customer brief text is preserved; combined content is still bounded by the existing server validation. No database migration, authentication change or new public data policy is needed.

## Production scope

These are reusable frontend starting points. Delivery for an actual customer requires their approved assets/content, supported hosting, and the integrations in their signed scope. Luma's in-memory calendar is not a booking provider; Morrow's in-memory checkout is not a payment gateway or source of inventory truth. Do not copy simulated confirmations into a production integration or describe these demos as completed client work.
