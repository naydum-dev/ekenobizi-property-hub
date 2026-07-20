import { supabase } from '../lib/supabase'

/**
 * Writes one entry to the audit_log table.
 * Fire-and-forget by design: logging failures should never block
 * the actual admin action (approve/reject/delete) from completing.
 */
export async function logAction(action, entityId) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.error('Cannot log action: no authenticated user')
    return
  }

  const { error } = await supabase.from('audit_log').insert({
    action,
    entity: 'property',
    entity_id: entityId,
    performed_by: user.id,
  })

  if (error) {
    // Logged but not surfaced to the admin — the primary action already succeeded
    console.error('Failed to write audit log entry:', error)
  }
}