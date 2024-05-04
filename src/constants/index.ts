import { ApartmentOutlined, DashboardOutlined, FileTextOutlined, ProjectOutlined, UserOutlined } from '@ant-design/icons'
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
  },
  getMe: '/api/v1/admins/me',
  season: '/api/v1/seasons',
  document: '/api/v1/documents',
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
    path: '/student',
    children: [
      {
        path: '/student/transactions',
        name: 'Danh sách học viên',
      },
    ],
  },
]

export const OPTIONS_ROLE = Object.keys(EAdminRoleDetail).map((key) => ({
  value: key,
  label: EAdminRoleDetail[key as EAdminRole],
}))
