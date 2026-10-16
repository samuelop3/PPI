-- Run after deploying send-due-notifications and configuring its secrets.
-- Replace both placeholders before running this script in the Supabase SQL Editor.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema net;

select vault.create_secret(
  'https://YOUR_PROJECT_REF.supabase.co',
  'ppi_supabase_url',
  'Supabase URL used by the PPI notification scheduler'
);
select vault.create_secret(
  'REPLACE_WITH_THE_SAME_CRON_SECRET_CONFIGURED_ON_THE_EDGE_FUNCTION',
  'ppi_notification_cron_secret',
  'Authentication secret for the PPI notification scheduler'
);

select cron.unschedule(jobid)
from cron.job
where jobname = 'ppi-send-due-notifications';

select cron.schedule(
  'ppi-send-due-notifications',
  '* * * * *',
  $job$
    select net.http_post(
      url := (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'ppi_supabase_url'
      ) || '/functions/v1/send-due-notifications',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'ppi_notification_cron_secret'
        )
      ),
      body := '{}'::jsonb
    );
  $job$
);
