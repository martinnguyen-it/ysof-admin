import { DashboardOutlined, FileTextOutlined, ProjectOutlined, UserOutlined } from '@ant-design/icons'
import { IRouter } from '@domain/app'

export const API_CONFIG = {
  isLoggingEnable: false,
  timeout: 600000,
  unauthorizedErrorCode: 401,
  HOST: process.env.REACT_APP_BASE_URL || 'http://localhost:8000',
}

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
}

export const ROUTES_SIDEBAR: IRouter[] = [
  {
    name: 'Bảng tin',
    path: '/',
    icon: DashboardOutlined,
  },
  {
    name: 'Tài liệu',
    path: '/document',
    icon: FileTextOutlined,
  },
  {
    name: 'Công việc',
    path: '/work',
    icon: ProjectOutlined,
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
