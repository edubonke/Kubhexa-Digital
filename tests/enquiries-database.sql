-- Run after the migration in an isolated development database. All test rows
-- are synthetic and the transaction always rolls back on a successful run.
begin;

do $$
begin
  if not (select relrowsecurity from pg_class where oid = 'public.kubhexa_enquiries'::regclass) then
    raise exception 'Enquiry RLS must be enabled';
  end if;
  if has_table_privilege('anon', 'public.kubhexa_enquiries', 'SELECT,INSERT,UPDATE,DELETE')
    or has_table_privilege('authenticated', 'public.kubhexa_enquiries', 'SELECT,INSERT,UPDATE,DELETE') then
    raise exception 'Visitors must have no direct enquiry table privileges';
  end if;
  if has_function_privilege('anon', 'public.kubhexa_submit_enquiry(jsonb)', 'EXECUTE')
    or has_function_privilege('authenticated', 'public.kubhexa_submit_enquiry(jsonb)', 'EXECUTE') then
    raise exception 'Visitors must not execute the private submission RPC';
  end if;
  if (select prosecdef from pg_proc where oid = 'public.kubhexa_submit_enquiry(jsonb)'::regprocedure) then
    raise exception 'The RPC must remain SECURITY INVOKER';
  end if;
end;
$$;

set local role anon;
do $$
begin
  begin
    perform * from public.kubhexa_enquiries;
    raise exception 'Anonymous enquiry reads unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.kubhexa_submit_enquiry('{}'::jsonb);
    raise exception 'Anonymous RPC unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
end;
$$;

set local role authenticated;
do $$
begin
  begin
    perform * from public.kubhexa_enquiries;
    raise exception 'A generic signed-in user could read enquiries';
  exception when insufficient_privilege then null;
  end;
end;
$$;

set local role service_role;
do $$
declare
  enquiry_id uuid := gen_random_uuid();
  test_email text := 'kubhexa-qa-' || gen_random_uuid()::text || '@example.invalid';
  payload jsonb;
  result jsonb;
  total integer;
begin
  payload := jsonb_build_object('id', enquiry_id, 'name', 'Synthetic QA Founder', 'email', test_email, 'company', 'Synthetic QA', 'projectType', 'Website', 'budget', 'Help me scope it', 'timeline', 'Exploring options', 'brief', 'Synthetic enquiry to test private storage and duplicate request handling.', 'consent', true);
  result := public.kubhexa_submit_enquiry(payload);
  if result ->> 'status' <> 'received' or result ->> 'reference' <> enquiry_id::text then
    raise exception 'Valid submission was not acknowledged correctly';
  end if;
  result := public.kubhexa_submit_enquiry(payload);
  select count(*) into total from public.kubhexa_enquiries where email = test_email;
  if result ->> 'status' <> 'received' or total <> 1 then
    raise exception 'An identical retry must not create a duplicate';
  end if;
  result := public.kubhexa_submit_enquiry(payload || jsonb_build_object('brief', 'Changed details must not be silently accepted under an existing reference.'));
  if result ->> 'status' <> 'conflict' then raise exception 'A changed duplicate must return conflict'; end if;
  for i in 1..4 loop
    result := public.kubhexa_submit_enquiry(payload || jsonb_build_object('id', gen_random_uuid()));
    if result ->> 'status' <> 'received' then raise exception 'Five legitimate enquiries should be accepted'; end if;
  end loop;
  result := public.kubhexa_submit_enquiry(payload || jsonb_build_object('id', gen_random_uuid()));
  select count(*) into total from public.kubhexa_enquiries where email = test_email;
  if result ->> 'status' <> 'rate_limited' or total <> 5 then raise exception 'Hourly rate limit did not hold'; end if;
  result := public.kubhexa_submit_enquiry(payload);
  if result ->> 'status' <> 'received' then raise exception 'A saved retry should work after the quota is reached'; end if;
  begin
    perform public.kubhexa_submit_enquiry(payload || jsonb_build_object('id', gen_random_uuid(), 'email', 'invalid-consent-' || test_email, 'consent', false));
    raise exception 'A nonconsensual enquiry was stored';
  exception when check_violation then null;
  end;
end;
$$;

reset role;
rollback;
