import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

Deno.serve(async (request) => {
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405)

  const cronSecret = Deno.env.get('CRON_SECRET')
  const authorization = request.headers.get('Authorization')
  if (!cronSecret || authorization !== ['Bearer', cronSecret].join(' ')) {
    return jsonResponse({ error: 'Unauthorized' }, 401)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const fromAddress = Deno.env.get('RESEND_FROM')
  if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !fromAddress) {
    console.error('Missing required notification worker configuration.')
    return jsonResponse({ error: 'Notification worker is not configured.' }, 500)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data: notifications, error: claimError } = await supabase.rpc('claim_due_notifications')
  if (claimError) {
    console.error('Unable to claim due notifications:', claimError.message)
    return jsonResponse({ error: 'Unable to claim scheduled notifications.' }, 500)
  }

  let delivered = 0
  let failed = 0
  for (const notification of notifications ?? []) {
    let success = false
    let failure = ''

    if (!notification.email_address) {
      failure = 'No se configuró un correo de destino.'
    } else {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: ['Bearer', resendApiKey].join(' '),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [notification.email_address],
            subject: notification.title,
            text: `${notification.message}\n\nProgramado para: ${new Date(notification.scheduled_at).toLocaleString('es-CO')}`,
          }),
        })
        if (response.ok) success = true
        else failure = `El proveedor de correo devolvió HTTP ${response.status}.`
      } catch (error) {
        failure = error instanceof Error ? error.message : 'Error de conexión con el proveedor de correo.'
      }
    }

    const { error: finishError } = await supabase.rpc('finish_notification', {
      notification_id: notification.id,
      was_delivered: success,
      failure_message: failure,
    })
    if (finishError) {
      console.error(`Unable to update notification ${notification.id}:`, finishError.message)
      failed += 1
    } else if (success) {
      delivered += 1
    } else {
      failed += 1
    }
  }

  return jsonResponse({ claimed: notifications?.length ?? 0, delivered, failed })
})
