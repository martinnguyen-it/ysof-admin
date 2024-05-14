import { ApartmentOutlined, DashboardOutlined, FileTextOutlined, HistoryOutlined, ProjectOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons'
import { AdminIcon, LessonIcon, RegisterIcon, SubjectEvaluationIcon } from '@components/assets/svg'
import { EAdminRole, EAdminRoleDetail } from '@domain/admin/type'
import { IRouter } from '@domain/app'

export const API_CONFIG = {
  isLoggingEnable: false,
  timeout: 600000,
  unauthorizedErrorCode: 401,
  HOST: process.env.REACT_APP_BASE_URL || 'http://localhost:8000',
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
  },
  me: '/api/v1/admins/me',
  admin: '/api/v1/admins',
  season: '/api/v1/seasons',
  document: '/api/v1/documents',
  generalTask: '/api/v1/general-tasks',
  lecturer: '/api/v1/lecturers',
  subject: '/api/v1/subjects',
  subjectRegistration: '/api/v1/subjects/registration',
  subjectEvaluationQuestions: '/api/v1/subjects/evaluation-questions',
  subjectSendNotification: '/api/v1/subjects/send-notification',
  subjectSendEvaluation: '/api/v1/subjects/send-evaluation',
  evaluation: '/api/v1/subjects/evaluations',
  evaluationQuestion: '/api/v1/subjects/evaluation-questions',
  student: '/api/v1/students',
  manageForm: '/api/v1/manage-form',
  auditLog: '/api/v1/audit-logs',
}

export const ROUTES_SIDEBAR: IRouter[] = [
  {
    name: 'Bảng tin',
    path: '/',
    icon: DashboardOutlined,
  },
  {
    name: 'Mùa',
    path: '/mua',
    icon: ApartmentOutlined,
  },
  {
    name: 'Công việc chung',
    path: '/cong-viec-chung',
    icon: ProjectOutlined,
  },
  {
    name: 'Tài liệu',
    path: '/tai-lieu',
    icon: FileTextOutlined,
  },
  {
    name: 'Học viên',
    icon: UserOutlined,
    requiredCurrent: true,
    path: '/hoc-vien',
    children: [
      {
        path: '/hoc-vien/danh-sach-hoc-vien',
        name: 'Danh sách học viên',
      },
    ],
  },
  {
    name: 'Chủ đề',
    icon: LessonIcon,
    path: '/chu-de',
    children: [
      {
        path: '/chu-de/danh-sach-chu-de',
        name: 'Danh sách chủ đề',
      },
      {
        path: '/chu-de/gui-email',
        requiredCurrent: true,
        name: 'Gửi email thông báo',
        role: [EAdminRole.BHV],
      },
    ],
  },
  {
    name: 'Lượng giá',
    icon: SubjectEvaluationIcon,
    path: '/luong-gia',
    requiredCurrent: true,
    children: [
      {
        path: '/luong-gia/quan-ly-form',
        name: 'Quản lý form',
        requiredCurrent: true,
        role: [EAdminRole.BHV],
      },
      {
        path: '/luong-gia/ket-qua',
        name: 'Kết quả',
        requiredCurrent: true,
      },
    ],
  },
  {
    name: 'Đăng ký môn học',
    icon: RegisterIcon,
    path: '/dang-ky-mon',
    requiredCurrent: true,
    children: [
      {
        path: '/dang-ky-mon/quan-ly-form',
        name: 'Quản lý form',
        requiredCurrent: true,
        role: [EAdminRole.BKL, EAdminRole.BHV],
      },
      {
        path: '/dang-ky-mon/ket-qua-dang-ky',
        name: 'Kết quả đăng ký',
        requiredCurrent: true,
      },
    ],
  },
  {
    name: 'Giảng viên',
    path: '/giang-vien',
    icon: SolutionOutlined,
  },
  {
    name: 'Ban tổ chức',
    path: '/ban-to-chuc',
    icon: AdminIcon,
    requiredCurrent: true,
  },
  {
    name: 'Nhật ký chỉnh sửa',
    path: '/nhat-ky-chinh-sua',
    icon: HistoryOutlined,
    requiredCurrent: true,
    role: [EAdminRole.ADMIN],
  },
]

export const OPTIONS_ROLE = Object.keys(EAdminRoleDetail).map((key) => ({
  value: key,
  label: EAdminRoleDetail[key as EAdminRole],
}))
