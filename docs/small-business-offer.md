# Small-business website offer

Approved conversation offer, added 20 October 2026. Public section: `#packages`.

## Customer offer

The customer selects a package and industry direction. Kubhexa confirms a suitable template, demo, scope and final quote before taking a deposit. The current site accepts enquiries, not purchases. No payment gateway, ready-made template inventory, automated onboarding portal, or subscription billing has been claimed or implemented.

| Package | Once-off fee | Scope | Delivery after complete assets, access and deposit |
| --- | ---: | --- | --- |
| Start | R2,990 | One page, up to six sections | 3–5 working days |
| Business | R5,990 | Up to five pages, one enquiry/quote form | 7–10 working days |
| Showcase | R8,990 | Up to eight pages, 20 editable menu/portfolio/catalogue entries | 10–15 working days |
| Bookings | R11,990 | Five pages, supported third-party scheduling, one location/three staff/ten services | 10–15 working days |
| Shop | R17,990 | Five content pages plus store pages, 30 products/60 variants, one gateway, collection/three simple delivery zones | 15–20 working days |

All packages include supplied brand customisation, responsive layouts, search foundations, launch checks, two consolidated revision rounds and 30 days of defect fixes. One business, one language, an existing template layout. Extra scope must be quoted in advance.

Template families: Services & Trades, Professional Services, Beauty & Wellness, Food & Hospitality, Creative & Portfolio and Retail. These are enquiry directions, not a claim that six ready-made templates already exist. Future demos must be genuinely interactive and accurately labelled before adding purchase controls.

## Care and extras

- Essential Care R349/month: low-change brochure sites; hosting, SSL, monitoring, daily backups and routine maintenance. Content work separate.
- Business Care R749/month: content/booking websites; Essential coverage plus CMS/plugin maintenance as applicable and 30 minutes of edits.
- Commerce Care R1,499/month: hosting appropriate to the agreed store, backups, maintenance, monthly store checkout check, one hour of edits.
- Month to month, 30 days' notice, editing time expires monthly. Agree hosting capacity and backup retention in writing.
- Extra page R750; up-to-five-page copywriting R2,000 (400 words maximum each); starter logo kit R2,500 (two concepts/two rounds/final files/palette); ten simple products R750 for Shop; blog plus first supplied article R1,500; additional content/revisions R650/hour with approval.

Domains, external subscriptions, merchant processing, email services and paid licences are separate. VAT only if applicable to Kubhexa's registration; the final quote must confirm its treatment before a deposit. Do not imply that Kubhexa is VAT registered.

Client gets a perpetual single-business licence to the completed Kubhexa template site. Kubhexa retains its reusable template system. Client content, domains and business accounts stay under client control; third-party licences and platform export limits must be disclosed. Agree cancellation and handover terms in the actual contract. No automatic legal compliance, rankings or sales guarantee.

Payment: 50% deposit after scope/final quote, balance after approval before launch. Specialist systems, memberships, medical records, accommodation inventory, complex integrations, custom apps, translations and photography require separate scope.

## Estimator and enquiry implementation

`lib/packages.ts` is the shared source of prices, scope, compatibility and calculations. Package cards, estimator, care descriptions and add-on descriptions use this data. The estimator's first-year figure is **Kubhexa fees only**: one-off build plus extras plus twelve months of chosen care. No domain, third-party subscriptions or unknown VAT amounts are hidden in this figure. No care is selected by default.

The `kubhexa:package` event carries selection IDs/quantities rather than a caller-supplied price. The form regenerates the estimate from the catalogue, prefills the existing Website project type/budget, displays the choice and appends it to the submitted brief. The user's own brief remains required, unaltered and never silently truncated. Shared existing Zod validation and private Supabase storage continue unchanged. Selection removal and standard custom-project enquiries remain available. No additional personal data, database columns, public read policies, credentials or persistence are introduced.

## Internal commercial assumptions

These are suggested launch fees, not a claim of demonstrated demand or profitability. The public page intentionally contains customer scope, costs and process; internal production targets and competitor comparisons remain in this source document.

Assuming reusable templates already exist, target total production budgets of 6/12/18/24/36 hours for Start/Business/Showcase/Bookings/Shop. Each price yields approximately R500 per production hour **before** direct costs, sales time, overheads, template development investment and tax. Record actual time on the first five deliveries; adjust scope/prices if targets are repeatedly exceeded. Amortise initial template creation across sales separately.

## Pricing reference checks

Checked 20 October 2026. These are primary provider listings, not a market average or like-for-like comparison:

- Elamilanga: five pages R4,999; store option up to 20 products R7,499. https://web-design.elamilanga.co.za/services/
- Eminent WebX: promotional five-page package R5,530; promotional store up to 50 products R18,830. https://www.eminentwebx.co.za/pricing/
- xneelo: .co.za registration/renewal R110/year, VAT inclusive. https://xneelo.co.za/domains/
- Payfast: listed card rate 3.2% + R2 excluding VAT; separate payout/refund fees. https://payfast.io/fees/

Example: Business R5,990 + Essential R349 × 12 + domain R110 = R10,288, before any applicable VAT on Kubhexa fees. Provider prices may change; link to current schedules rather than hard-coding checkout assumptions.
