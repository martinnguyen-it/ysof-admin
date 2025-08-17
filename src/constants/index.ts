import { EAdminRole, EAdminRoleDetail } from '@/domain/admin/type'

export const API_CONFIG = {
  isLoggingEnable: false,
  timeout: 600000,
  unauthorizedErrorCode: 401,
  HOST: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
}

export const VN_TIMEZONE = 'Asia/Ho_Chi_Minh'

export const PAGE_SIZE_OPTIONS_DEFAULT = [10, 20, 50, 100, 300]

export const DEFAULT_TABLE_PAGINATION = {
  total: 0,
  totalPages: 1,
  pageIndex: 0,
  pageSize: 50,
}

export const DEFAULT_GET_LIST_QUERY = {
  pageIndex: 0,
  pageSize: 50,
}

export const API_LIST = {
  auth: {
    login: '/api/v1/admin/auth/login',
    changePassword: '/api/v1/admin/auth/change-password',
    forgotPassword: '/api/v1/admin/auth/forgot-password',
    verifyOTP: '/api/v1/admin/auth/verify-otp',
    resetPassword: '/api/v1/admin/auth/reset-password',
  },
  me: '/api/v1/admins/me',
  admin: '/api/v1/admins',
  season: '/api/v1/seasons',
  document: '/api/v1/documents',
  generalTask: '/api/v1/general-tasks',
  lecturer: '/api/v1/lecturers',
  subject: '/api/v1/subjects',
  subjectRegistration: '/api/v1/subjects/registration',
  subjectAbsent: '/api/v1/absents',
  subjectEvaluation: '/api/v1/subjects/evaluations',
  subjectEvaluationQuestions: '/api/v1/subjects/evaluation-questions',
  subjectSendNotification: '/api/v1/subjects/send-notification',
  subjectSendEvaluation: '/api/v1/subjects/send-evaluation',
  evaluation: '/api/v1/subjects/evaluations',
  evaluationQuestion: '/api/v1/subjects/evaluation-questions',
  student: '/api/v1/students',
  manageForm: '/api/v1/manage-form',
  auditLog: '/api/v1/audit-logs',
  getDailyBibleQuotes: '/api/v1/daily-bible/daily-quotes',
  updateAvatar: '/api/v1/admins/me/avatar',
  failedTask: '/api/v1/celery-result/failed',
  markResolvedFailedTasks: '/api/v1/celery-result/mark-resolved-failed',
  undoMarkResolvedFailedTasks: '/api/v1/celery-result/undo-mark-resolved',
}

export const OPTIONS_ROLE = Object.keys(EAdminRoleDetail).map((key) => ({
  value: key,
  label: EAdminRoleDetail[key as EAdminRole],
}))

export const MAX_AVATAR_SIZE = 80 * 1024 // 80KB
