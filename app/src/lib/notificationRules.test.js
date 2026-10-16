import assert from 'node:assert/strict'
import test from 'node:test'
import { getDueNotifications, validateNotificationInput } from './notificationRules.js'

const now = new Date('2026-10-16T12:00:00.000Z')

test('requires a non-empty reminder message', () => {
  assert.equal(
    validateNotificationInput({ message: '   ', scheduledAt: '2026-10-16T13:00', emailAddress: '', now }),
    'Escribe un mensaje para el recordatorio.',
  )
})

test('rejects messages longer than the database limit', () => {
  assert.equal(
    validateNotificationInput({
      message: 'x'.repeat(501),
      scheduledAt: '2026-10-16T13:00:00.000Z',
      emailAddress: '',
      now,
    }),
    'El mensaje no puede superar los 500 caracteres.',
  )
})

test('rejects reminders scheduled in the past or at the current time', () => {
  assert.match(
    validateNotificationInput({ message: 'Aviso', scheduledAt: now.toISOString(), emailAddress: '', now }),
    /futuras válidas/,
  )
})

test('requires a recipient for server-scheduled reminders', () => {
  assert.match(
    validateNotificationInput({
      message: 'Aviso',
      scheduledAt: '2026-10-16T13:00:00.000Z',
      emailAddress: ' ',
      requiresEmail: true,
      now,
    }),
    /Indica un correo/,
  )
})

test('accepts a future reminder with an email recipient', () => {
  assert.equal(
    validateNotificationInput({
      message: 'Aviso',
      scheduledAt: '2026-10-16T13:00:00.000Z',
      emailAddress: 'persona@example.com',
      requiresEmail: true,
      now,
    }),
    null,
  )
})

test('returns only due reminders that are still eligible for delivery', () => {
  const notices = [
    { id: 'due', scheduledAt: '2026-10-16T11:59:00Z' },
    { id: 'future', scheduledAt: '2026-10-16T12:01:00Z' },
    { id: 'delivered', scheduledAt: '2026-10-16T11:00:00Z', delivered: true },
    { id: 'failed', scheduledAt: '2026-10-16T11:00:00Z', failed: true },
    { id: 'processing', scheduledAt: '2026-10-16T11:00:00Z', processing: true },
    { id: 'invalid', scheduledAt: 'not a date' },
  ]
  assert.deepEqual(getDueNotifications(notices, now).map((notice) => notice.id), ['due'])
  assert.deepEqual(getDueNotifications(notices, now, true).map((notice) => notice.id), ['due', 'processing'])
})
