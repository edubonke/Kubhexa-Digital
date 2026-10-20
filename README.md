# Kubhexa Digital

A responsive website for the Kubhexa web, app and product design studio. It includes staged hero and scroll motion, pointer interactions, accessible dialogs and navigation, working concept demos, an Experience Lab, and a project enquiry form.

## Destinations

- Repository: https://github.com/edubonke/Kubhexa-Digital
- Planned Pages URL: https://edubonke.github.io/Kubhexa-Digital/
- Supabase project: `dqpxsjeeqoadogoadyts`
- Public function: `https://dqpxsjeeqoadogoadyts.supabase.co/functions/v1/kubhexa-enquiries`

These public settings are in `site.config.json`. The project URL alone does not deploy the database or function. See [the activation guide](docs/github-pages-supabase.md) for the remaining setup and its current verification limits.

## Build and test

Use Node 24 and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm run check
pnpm test
pnpm build
pnpm preview
```

The build prerenders HTML into `out/` and hydrates the same React components for interactions. It supports the repository path without a server or SPA redirect. Home, privacy, 404, artwork and fonts are included. No database secret is shipped to the browser. Environment overrides for a different domain or project are documented in the guide.

## Enquiries

The public Edge Function validates form submissions, then saves them through a private Postgres RPC. The enquiry table has RLS enabled and no anonymous or generic signed-in access. Successful requests return a reference; failed requests retain the form values. Repeated requests do not create duplicate rows, and a per-email quota is checked within a database transaction.

The function does not send email or reserve calendar appointments. The portfolio pieces and interactive workspace remain clearly labelled concept demonstrations.

## Automation

The Website checks workflow runs frontend and handler type checks, request tests, SQL migration/access tests in an isolated PostgreSQL service, and the static build. Its publish job runs only when requested or after `PAGES_DEPLOY_ENABLED=true` is set. It checks function availability before publishing. Enable Pages through repository Settings → Pages → GitHub Actions before the first publication.

The Supabase setup workflow can deploy the namespaced migration and public function once the project administrator configures its protected GitHub Actions secrets. The guide includes the exact steps; private credentials belong in the secret settings.

Artwork was generated for this brand. Fonts are self-hosted; their licences are in `public/assets/font-licenses/`.
