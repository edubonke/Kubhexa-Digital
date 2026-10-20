# Interactive project portfolio

The homepage features only the three projects selected by the founder: EduBonke, ShiftStart and Alphasonic International. Entries live in `lib/portfolio.ts`. Actual public-site screenshots are optimised as WebP images in `public/assets/projects/`.

Project types and founder attribution are explicit. EduBonke is a product prototype, ShiftStart an independent product, and Alphasonic a business website. No client relationship, delivery date, performance metric or testimonial is invented. The older booking and customer workspace design studies remain under a separate expandable concepts section.

Each project opens a native modal dialog. A single website frame is created only while the viewer is open and removed when closed. Visitors can scroll the embedded site, select desktop or mobile width, reload, expand the viewer or open the original website in a new tab. Device changes resize the existing frame without restarting it. Reload deliberately starts it again. Escape closes the modal, background scrolling is locked, and focus returns to the opening control.

EduBonke previews `/EduBonke/demo/`, which offers student and staff demonstrations with synthetic data and no account. Its **Open website** link leads to the public landing page. The other two previews use their public homepages.

The frame uses a sandbox with script, form and popup support. Same-host projects retain an opaque origin; cross-origin projects can use their own storage without sharing the portfolio origin. Top-level navigation, camera, microphone, geolocation and payment are disabled. Some browser storage or external-site policies can restrict embedded functionality; the original website and direct experience links always remain available. A frame load event alone is not treated as proof that an external site rendered successfully. EduBonke's optional PWA registration skips embedded contexts so its public demo can run without service-worker access.

To add a project, verify the public URL, classify its status, capture an actual screenshot without private information, optimise it, and add one entry to the collection. Keep HTTPS URLs and first-party public demos. Respect private site audiences. Check its interactive preview after deployment, including any navigation and storage requirements. Do not add login credentials or private records to an entry.

Build and type checks run through the existing GitHub workflow. After checks pass, pushes to `main` publish the static site with the enquiry function availability check still required.
