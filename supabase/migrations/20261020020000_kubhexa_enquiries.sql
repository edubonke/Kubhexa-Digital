begin;

-- A dedicated name prevents collisions with other applications in the project.
create table public.kubhexa_enquiries (
  id uuid primary key,
  name text not null check (char_length(btrim(name)) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254 and email = lower(btrim(email))),
  company text not null default '' check (char_length(company) <= 160),
  project_type text not null check (project_type in ('Website', 'App or business system', 'UX and product design', 'Not sure yet', 'Other')),
  budget text not null check (budget in ('Under R15,000', 'R15,000 to R40,000', 'R40,000 to R100,000', 'R100,000+', 'Help me scope it')),
  timeline text not null check (timeline in ('As soon as practical', 'Within 1 to 3 months', 'Within 3 to 6 months', 'Exploring options')),
  brief text not null check (char_length(btrim(brief)) between 20 and 4000),
  consent boolean not null check (consent = true),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default clock_timestamp()
);

create index kubhexa_enquiries_email_created_idx on public.kubhexa_enquiries (email, created_at desc);
alter table public.kubhexa_enquiries enable row level security;
revoke all on table public.kubhexa_enquiries from public, anon, authenticated;
grant select, insert on table public.kubhexa_enquiries to service_role;

-- No public RLS policies: visitors cannot read or write the table directly.
-- Only the Edge Function's server credential may execute this RPC. The
-- transaction lock makes the per-email hourly limit atomic across requests.
create function public.kubhexa_submit_enquiry(payload jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  submission_id uuid := (payload ->> 'id')::uuid;
  submission_email text := lower(btrim(payload ->> 'email'));
  saved public.kubhexa_enquiries%rowtype;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(submission_email, 77119));

  if not exists (select 1 from public.kubhexa_enquiries where id = submission_id) then
    if (select count(*) from public.kubhexa_enquiries where email = submission_email and created_at >= clock_timestamp() - interval '1 hour') >= 5 then
      return jsonb_build_object('status', 'rate_limited');
    end if;
    insert into public.kubhexa_enquiries (id, name, email, company, project_type, budget, timeline, brief, consent)
    values (submission_id, payload ->> 'name', submission_email, coalesce(payload ->> 'company', ''), payload ->> 'projectType', payload ->> 'budget', payload ->> 'timeline', payload ->> 'brief', (payload ->> 'consent')::boolean)
    on conflict (id) do nothing;
  end if;

  select * into strict saved from public.kubhexa_enquiries where id = submission_id;
  if saved.name is distinct from (payload ->> 'name')
    or saved.email is distinct from submission_email
    or saved.company is distinct from coalesce(payload ->> 'company', '')
    or saved.project_type is distinct from (payload ->> 'projectType')
    or saved.budget is distinct from (payload ->> 'budget')
    or saved.timeline is distinct from (payload ->> 'timeline')
    or saved.brief is distinct from (payload ->> 'brief')
    or saved.consent is distinct from ((payload ->> 'consent')::boolean) then
    return jsonb_build_object('status', 'conflict');
  end if;
  return jsonb_build_object('status', 'received', 'reference', saved.id);
end;
$$;

revoke all on function public.kubhexa_submit_enquiry(jsonb) from public, anon, authenticated;
grant execute on function public.kubhexa_submit_enquiry(jsonb) to service_role;

comment on table public.kubhexa_enquiries is 'Private Kubhexa Digital project enquiries. Public submission is mediated by the kubhexa-enquiries Edge Function.';
commit;
