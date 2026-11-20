# Cobalt redesign

Reference: Google AI Studio app `9269cfb3-67b4-40d8-bf78-75f347b0fd0b`.
The source was verified in `edubonke/Kubhexa-Digital-V2` at commit `6ca2d9b`, whose AI Studio artifacts contain that exact app ID.

The refreshed presentation uses the source's deep navy canvas, cobalt hero sculpture, technical grid, editorial type, metric strip, alternating featured project rows, and separately navigable interface concepts. The existing logo, six template demonstrations, estimator pricing, validated enquiry submission, project preview safeguards, privacy page, and existing GitHub Pages/Supabase deployment flow are retained. No new dependencies or secrets are introduced.

The branded catalogue and privacy pages share the new colour theme; each fictional template demo continues to use its own theme. Use the existing motion preference or OS reduced-motion setting to disable animation.

## Review checklist

- Run `pnpm run check`, `pnpm test`, `pnpm build`.
- Review the home page at desktop, tablet, and phone widths; verify logo, hero artwork, nav, cards and form.
- Open and close each of the three project previews; test responsive device controls and the direct-site link.
- Try the booking and customer portal concepts and the Experience Lab.
- Choose a website package, update the estimate, and attach it to the contact form. Verify an invalid form is rejected and retains inputs. Use the existing backend workflow and an authorised test enquiry for a production submission.
- Open the template catalogue and each template's preview independently; their fictional demo interactions must remain working.
- Check keyboard navigation and reduced-motion mode before production deployment.
