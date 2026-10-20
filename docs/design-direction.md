# Kubhexa Digital design direction

Read as a premium B2B creative studio for growing South African businesses, using a spacious light editorial system. Brand decisions come from the approved conversation. Design variance 8, motion intensity 6, visual density 3. Native CSS and React, prerendered and bundled with Vite for GitHub Pages; this is a custom brand system.

## Reference analysis

Hero: 76 px horizontal navigation, 64 px desktop gutters, a three-line grotesk headline with cobalt final line, concise supporting text and a clear filled primary action. Sculptural K occupies the right side and stays subordinate to the main message. Hero body fits a small laptop viewport.

Work: open gallery on a 58/42 desktop grid. Blue desktop and lime mobile imagery share controlled media frames, with captions outside imagery. Work is explicitly labelled concept exploration, with genuine interactive example flows rather than invented client results.

Services: divider-led capability rows. Large headings, outline icons, readable supporting copy, and one expanded panel. Thin neutral rules establish rhythm without nested cards.

Approach and studio: four plain numbered process columns, then a large native vector K beside the founder story. The name is the heritage connection; no cultural symbolism or founder credentials are invented.

Contact: a 44/56 editorial split, strong two-line heading, visible labels, generous input sizes, a wide cobalt submit button, and a practical privacy explanation. Confirmation requires a successful server save.

## Design tokens and behaviour

Paper #F7F8FC, ink #101828, cobalt #2457E6, slate #475467, lime #B7F36B. Space Grotesk Variable headings and Inter Variable reading text are self-hosted through installed font packages. Buttons are pills, media and inputs use 8 px corners, and layout sections remain open.

The motion system uses finite, staggered hero entrances; one-time section reveals; small pointer tilts and magnetic CTA feedback; animated accordions, menus and dialogs; and progress and task feedback in the Experience Lab. A CSS scroll timeline draws a thin reading-progress line where supported. Same-origin document view transitions enhance navigation where supported, with ordinary navigation as the fallback. No animation library or background timer is added. Intersection observers disconnect on cleanup and completed reveals do not replay on each scroll. Pointer updates use requestAnimationFrame and CSS variables rather than React state. Content remains present before JavaScript runs; reveal effects never leave sections hidden.

The Experience Lab lets visitors change the sample interface layout and theme, complete or reopen checklist tasks, inspect activity, and replay a finite entrance. State is local to this clearly labelled demonstration. The page remains in the light brand theme while the preview can be dark. No invented performance scores or timed simulations stand in for working controls.

Device reduced-motion settings and the footer's optional motion switch disable animation and smooth scrolling. The switch stores a tab-session preference. Keyboard focus cancels any reveal that contains the focused element; collapsed navigation and accordion contents are inert. Dialogs preserve native modal focus and restore the opener, or send focus to the enquiry form when that action was chosen.

Mobile: 20 px gutters, single-column gallery, full-width form fields, collapsed navigation, readable headings, and no information available only on hover. No fake testimonials, unverified statistics, invented contact information or nonfunctional social links.

## Asset provenance

The hero, work, service, approach and contact composition references were generated before frontend implementation. Separate original artwork was generated for the sculptural K, booking concept and customer portal concept. They were resized and encoded as WebP without changing the scenes. The K logo and favicon are editable native vector brand assets. Generated reference images are not embedded as webpage screenshots.
