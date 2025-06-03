import { IconLayoutDashboard } from '@tabler/icons-react'
import { EAdminRole } from '@/domain/admin/type'
import {
  ApartmentOutlined,
  FileTextOutlined,
  HistoryOutlined,
  IssuesCloseOutlined,
  ProjectOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  AdminIcon,
  LessonIcon,
  RegisterIcon,
  SubjectEvaluationIcon,
} from '@/assets/svg'
import { type NavItem } from '../types'

export const sidebarData: NavItem[] = [
  {
    title: 'Bảng tin',
    url: '/',
    icon: IconLayoutDashboard,
  },
  {
    title: 'Mùa',
    url: '/mua',
    icon: ApartmentOutlined,
  },
  {
    title: 'Công việc chung',
    url: '/cong-viec-chung',
    icon: ProjectOutlined,
  },
  {
    title: 'Tài liệu',
    url: '/tai-lieu',
    icon: FileTextOutlined,
  },
  {
    title: 'Học viên',
    icon: UserOutlined,
    url: '/hoc-vien',
  },
  {
    title: 'Chủ đề',
    icon: LessonIcon,
    items: [
      {
        url: '/chu-de/danh-sach-chu-de',
        title: 'Danh sách chủ đề',
      },
      {
        url: '/chu-de/gui-email',
        requiredCurrent: true,
        title: 'Gửi email thông báo',
        roles: [EAdminRole.BHV],
      },
      {
        url: '/chu-de/nghi-phep',
        requiredCurrent: true,
        title: 'Nghỉ phép',
      },
      {
        url: '/chu-de/ket-qua-diem-danh',
        requiredCurrent: true,
        title: 'Kết quả điểm danh',
      },
    ],
  },
  {
    title: 'Lượng giá',
    icon: SubjectEvaluationIcon,
    requiredCurrent: true,
    items: [
      {
        url: '/luong-gia/quan-ly-form',
        title: 'Quản lý form',
        requiredCurrent: true,
        roles: [EAdminRole.BHV],
      },
      {
        url: '/luong-gia/ket-qua',
        title: 'Kết quả',
        requiredCurrent: true,
      },
    ],
  },
  {
    title: 'Đăng ký môn học',
    icon: RegisterIcon,
    items: [
      {
        url: '/dang-ky-mon/quan-ly-form',
        title: 'Quản lý form',
        requiredCurrent: true,
        roles: [EAdminRole.BKL, EAdminRole.BHV],
      },
      {
        url: '/dang-ky-mon/ket-qua-dang-ky',
        title: 'Kết quả đăng ký',
      },
    ],
  },
  {
    title: 'Giảng viên',
    url: '/giang-vien',
    icon: SolutionOutlined,
  },
  {
    title: 'Ban tổ chức',
    url: '/ban-to-chuc',
    icon: AdminIcon,
    requiredCurrent: true,
  },
  {
    title: 'Nhật ký chỉnh sửa',
    url: '/nhat-ky-chinh-sua',
    icon: HistoryOutlined,
    requiredCurrent: true,
    roles: [EAdminRole.ADMIN],
  },
  {
    title: 'Quản lý lỗi tác vụ',
    url: '/quan-ly-loi-tac-vu',
    icon: IssuesCloseOutlined,
    requiredCurrent: true,
    roles: [EAdminRole.ADMIN],
  },
]
