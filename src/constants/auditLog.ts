import { EAuditLogType, EAuditLogEndPoint } from '@/domain/auditLog'
import { startCase } from 'lodash'

export const OPTIONS_AUDIT_LOG_TYPE = Object.values(EAuditLogType).map(
  (value) => ({ value, label: startCase(value) })
)
export const OPTIONS_AUDIT_LOG_ENDPOINT = Object.values(EAuditLogEndPoint).map(
  (value) => ({ value, label: value })
)
