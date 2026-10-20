# Activate Kubhexa Digital on GitHub Pages and Supabase

## Configured destinations

| Setting | Destination |
| --- | --- |
| GitHub source | `edubonke/Kubhexa-Digital` |
| Planned public website | `https://edubonke.github.io/Kubhexa-Digital/` |
| Supabase project | `dqpxsjeeqoadogoadyts` |
| Supabase Project URL | `https://dqpxsjeeqoadogoadyts.supabase.co` |
| Enquiry function | `/functions/v1/kubhexa-enquiries` |
| Allowed browser origin | `https://edubonke.github.io` |

These public settings are already in `site.config.json` and the Supabase setup workflow. The enquiry function returned HTTP 404 when checked before upload: its deployment is still required. The previous private Sites preview is separate, with its own records. Existing records have not been transferred to Supabase.

## 1. Configure backend credentials in GitHub

Open [repository Actions secrets](https://github.com/edubonke/Kubhexa-Digital/settings/secrets/actions). Choose **New repository secret** for each value:

| Secret name | Value supplied by the project administrator |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | A Supabase management access token from [account tokens](https://supabase.com/dashboard/account/tokens), for an account authorised on the selected project |
| `SUPABASE_DB_PASSWORD` | The selected project's database password |

Enter them in GitHub's secret settings. They are deployment credentials and do not belong in source files, the frontend configuration, or chat messages. The function's runtime server key is provisioned separately by Supabase; it is not a browser build setting.

## 2. Run the prepared Supabase setup

Open [Actions](https://github.com/edubonke/Kubhexa-Digital/actions), choose **Set up Kubhexa Supabase**, and select **Run workflow** on `main`.

The workflow links only `dqpxsjeeqoadogoadyts`, applies the committed namespaced migration, sets the exact allowed browser origin, deploys `kubhexa-enquiries`, and checks its preflight response. It uses a pinned Supabase CLI with API-based bundling. No local Docker installation is required. Remote database and function changes require the credentials above; the public project URL alone cannot authorise them.

The migration creates `public.kubhexa_enquiries`, its index, and `public.kubhexa_submit_enquiry(jsonb)`. It enables RLS, removes anonymous and generic authenticated table/RPC access, and permits server-mediated submission. It does not change another application's tables or authentication policies. The CLI checks migration history before applying changes; reconcile any existing history if this project is already shared with another application.

For manual setup, apply `supabase/migrations/20261020020000_kubhexa_enquiries.sql` in the project's SQL editor, set `KUBHEXA_ALLOWED_ORIGINS=https://edubonke.github.io` under Edge Function Secrets, and deploy the function from the repository root:

```sh
supabase login
supabase link --project-ref dqpxsjeeqoadogoadyts
supabase functions deploy kubhexa-enquiries --project-ref dqpxsjeeqoadogoadyts --use-api
```

Deploy from the repository root so the bundler includes `lib/enquiry-validation.ts`. `supabase/config.toml` sets this one public submission function to `verify_jwt = false`. Its `deno.json` pins Zod.

## 3. Enable Pages and publish

Open [repository Pages settings](https://github.com/edubonke/Kubhexa-Digital/settings/pages). Under **Build and deployment**, set **Source** to **GitHub Actions**.

In [Actions](https://github.com/edubonke/Kubhexa-Digital/actions), choose **Website checks and GitHub Pages**, select **Run workflow**, tick **publish**, and run on `main`. The build must pass and the enquiry function must accept the website origin before publication.

A successful deployment returns the actual public URL. Until that success is verified, the URL above is a destination rather than a confirmed live site. For future pushes to publish automatically, add the repository Actions **variable** `PAGES_DEPLOY_ENABLED` with value `true`. Without it, pushes run checks and produce a build artifact; publication remains an explicit workflow option.

## 4. Verify the first live enquiry

Submit one clearly labelled test enquiry through the deployed form. Confirm a matching row in Supabase Table Editor → `kubhexa_enquiries`, and confirm that the browser receipt matches its reference. Reuse the same request ID when checking retries: an identical payload must not create a second row. Unauthenticated callers must not be able to read the table or call the private RPC.

The successful preflight check confirms function availability and origin settings. It does not prove a database insert. Real Supabase/PostgREST access and the first saved enquiry still need verification after backend deployment.

Review homepage and privacy on desktop and mobile. Try the dialogs, checklist and activity, layout switch, dark preview, keyboard navigation, and motion controls. Refresh `/Kubhexa-Digital/privacy/` directly. Managed browser visual QA was unavailable during preparation.

## Local build and checks

Use Node 24 and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm run check
pnpm test
pnpm build
pnpm preview
```

`out/` contains prerendered homepage and privacy HTML, a 404 page, browser JavaScript, CSS, self-hosted fonts and licences, and WebP artwork. It contains no server runtime, database credentials, SQL, or private records. The same React components supply the design and interactive demonstrations.

The GitHub checks also apply the migration and rollback-only SQL tests to an isolated PostgreSQL service. Synthetic tests cover RLS and role privileges, storage, identical retries, conflicts, consent, and the hourly quota. Node tests cover invalid input, body limits, allowed/disallowed origins, storage errors and receipt correctness. They do not replace real-project verification after deployment.

For a different domain or repository, update `site.config.json` and the allowed origin in the Supabase workflow. Optional environment overrides are `KUBHEXA_SUPABASE_URL`, `PAGES_SITE_URL`, `PAGES_BASE_PATH`, and `PAGES_ALLOW_INDEXING`. A production-local env file is ignored. Inconsistent URL/path settings fail the build. Set `allowIndexing` to `true` in the config when the website is ready for search indexing.

## Enquiry handling

The browser calls only the public Edge Function. A server credential invokes the private database function. The server validates the same schema as the form, caps request bytes, rejects honeypots, and applies an atomic five-per-email hourly quota. Identical retries return the saved reference; changed details under an existing reference return a conflict. Errors do not expose enquiry data or raw backend errors. Form values stay present on failure, and receipts require a matching acknowledgement.

Origins and email quotas are basic abuse controls, not caller authentication: non-browser clients can spoof headers and change email addresses. Significant spam may require an extra server-verified challenge or network limit. A publishable browser key is not required for this anonymous-function design. Only authorised project administrators should review records. There is no public admin portal.

The form does not send an email or reserve a calendar appointment. These need separate integrations. The portfolio and Experience Lab remain labelled concept work.

## Official references

- [GitHub Pages deployment](https://vite.dev/guide/static-deploy#github-pages)
- [Supabase CLI deployment](https://supabase.com/docs/guides/functions/quickstart)
- [Supabase function authentication](https://supabase.com/docs/guides/functions/auth)
- [Supabase environment variables](https://supabase.com/docs/guides/functions/secrets)
- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
