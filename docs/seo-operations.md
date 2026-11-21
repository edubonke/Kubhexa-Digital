# Kubhexa Digital SEO operations

The production build creates the marketing routes from `lib/seo-content.json`. `site.config.json` enables marketing indexing; the `static/render.tsx` manifest excludes the six fictional previews and privacy. The build derives sitemap and robots meta from the same policy. Keep previews accessible for users, but excluded from search. Only a root deployment can generate an effective origin-level robots.txt; do not publish a misleading project-path robots.txt.

## After deployment

1. Open the live home and `/sitemap.xml`. Check the marketing canonical URLs, robots meta and actual HTTP response. Inspect the preview and privacy directives. Use Search Console URL Inspection and submit the sitemap via the URL-prefix property `https://edubonke.github.io/Kubhexa-Digital/` after owner verification. Import that property to Bing Webmaster Tools or verify it separately.
2. Test the mobile homepage, package estimator, contact form and previews using a controlled mock or authorised test account. Validate structured data with Schema Markup Validator. Run PageSpeed Insights for home, packages and one service page; record mobile and desktop lab results, and field CWV if available.
3. Connect GA4 only after confirming the measurement ID, privacy notice and consent requirements. A local `kubhexa:generate_lead` event is emitted only after the server reports receipt of the matching enquiry reference; connect a consent-aware tracker to this event without collecting personal details, form text or receipt IDs. Do not count simulated demo actions or failed submissions as leads. Mark `generate_lead` a key event and verify in DebugView using an authorised test.
4. Confirm genuine business email, phone and service areas before publishing them. Establish GBP eligibility: a solely online agency is not eligible; if the agency serves customers in person, follow Google's service-area guidance and hide a non-customer-facing address. Do not invent reviews, NAP, coverage or geo coordinates. Use Organization schema until verified facts justify LocalBusiness markup.
5. Publish and improve resources monthly using GSC query data. Review and expand case studies with authentic project details and verified outcomes, subject to permission. Prioritise relevant project attribution links, South African business partnerships and useful content outreach over purchased links. Keep a log of contact permission and acquired referring domains.
6. Monthly: record indexed eligible URLs, GSC impressions/clicks/CTR/queries, organic sessions, completed enquiries, conversion rate, referring domains, lab/field performance and actions taken. Compare 28-day periods, segment brand/non-brand and commercial/resource pages. No traffic guarantees.

## Hosting and domain

The current project base path is retained. Review GitHub Pages commercial-use suitability and a branded domain/appropriate host with the founder before migrating. Plan new canonical paths, redirects, DNS, HTTPS, Supabase allowlisted origins, analytics and GSC property change; test staging before switching. Do not register a domain or change DNS without approval.
