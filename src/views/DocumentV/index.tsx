import { FC, MouseEvent, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useGetListDocuments } from '@/apis/document/useQueryDocument'
import { userInfoState } from '@/atom/authAtom'
import { currentSeasonState, selectSeasonState } from '@/atom/seasonAtom'
import { EAdminRole, EAdminRoleDetail } from '@/domain/admin/type'
import { ESort, IOpenForm } from '@/domain/common'
import { EDocumentType, IDocumentInResponse } from '@/domain/document'
import {
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import type { MenuProps, TableProps } from 'antd'
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Input,
  Pagination,
  Select,
  Tooltip,
} from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { isArray, isObject } from 'lodash'
import { useRecoilValue } from 'recoil'
import { isSuperAdmin } from '@/lib/utils'
import {
  EDocumentTypeDetail,
  OPTIONS_DOCUMENT_LABEL,
  OPTIONS_DOCUMENT_TYPE,
} from '@/constants/document'
import {
  OPTIONS_ROLE,
  PAGE_SIZE_OPTIONS_DEFAULT,
  VN_TIMEZONE,
} from '@/constants/index'
import ModalAdd from './ModalAdd'
import ModalDelete from './ModalDelete'
import ModalUpdate from './ModalUpdate'

const DocumentV: FC = () => {
  const userInfo = useRecoilValue(userInfoState)
  const currentSeason = useRecoilValue(currentSeasonState)
  const [openForm, setOpenForm] = useState(false)
  const [openEdit, setOpenEdit] = useState<IDocumentInResponse>()
  const [openDel, setOpenDel] = useState<IOpenForm<string>>({ active: false })

  const initPaging = {
    current: 1,
    pageSize: 20,
  }
  const [tableQueries, setTableQueries] = useState(initPaging)
  const [paging, setPaging] = useState({ total: 0, current: 1 })
  const [search, setSearch] = useState('')
  const [roles, setRoles] = useState<EAdminRole[]>([])
  const [type, setType] = useState<EDocumentType>()
  const [label, setLabel] = useState<string[]>()
  const [sort, setSort] = useState<ESort>()
  const [sortBy, setSortBy] = useState<string>()

  const season = useRecoilValue(selectSeasonState)
  const { data, isLoading } = useGetListDocuments({
    page_index: tableQueries.current,
    page_size: tableQueries.pageSize,
    search,
    roles,
    type,
    label,
    sort,
    sort_by: sortBy,
    season,
  })

  useEffect(() => {
    if (data) {
      setPaging({
        current: data.pagination.page_index,
        total: data.pagination.total,
      })
    }
  }, [data])

  const onClickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setOpenForm(true)
  }

  const onClickUpdate = (id: string) => {
    const item = data?.data.find((val) => val.id === id)
    setOpenEdit(item)
  }

  const onClickDelete = (id: string) => {
    setOpenDel({ active: true, item: id })
  }

  useEffect(() => {
    setTableQueries(initPaging)
  }, [search])

  const columns: ColumnsType<IDocumentInResponse> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '60px',
      render: (_text, _record, index) =>
        index + 1 + (paging.current - 1) * tableQueries.pageSize,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      sorter: true,
      key: 'name',
      width: '200px',
      render: (text, record: IDocumentInResponse) => {
        return (
          <Avatar.Group className='flex items-center'>
            <img
              className='mr-4 size-7 object-cover'
              src={`https://drive-thirdparty.googleusercontent.com/64/type/${record?.mimeType}`}
            ></img>
            <Tooltip placement='bottom' title='Nhấn vào đây để xem file'>
              <Link
                to={record.webViewLink}
                target='_blank'
                className='text-wrap font-medium text-blue-500'
              >
                {text}
              </Link>
            </Tooltip>
          </Avatar.Group>
        )
      },
    },
    {
      title: 'Quản lý',
      dataIndex: 'role',
      key: 'role',
      sorter: true,
      render: (text: EAdminRole) => EAdminRoleDetail[text],
    },
    {
      title: 'Loại tài liệu',
      dataIndex: 'type',
      key: 'type',
      sorter: true,
      render: (text: EDocumentType) => EDocumentTypeDetail[text],
    },
    {
      title: 'Nhãn tài liệu',
      dataIndex: 'label',
      key: 'label',
      render: (text: string[]) => text.join(', '),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <span className='text-wrap italic'>{text}</span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      render: (text) => (
        <>{dayjs.utc(text).tz(VN_TIMEZONE).format('HH:mm DD-MM-YYYY')}</>
      ),
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: true,
      render: (text) => (
        <>{dayjs.utc(text).tz(VN_TIMEZONE).format('HH:mm DD-MM-YYYY')}</>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'name',
      sorter: true,
      key: 'name',
      width: '150px',
      render: (_, record: IDocumentInResponse) => {
        return (
          <Avatar.Group className='flex items-center'>
            <img
              className='mr-4 size-7 object-cover'
              referrerPolicy='no-referrer'
              src={record.author.avatar || '/images/avatar.png'}
            ></img>
            {/* <Link to={record.webViewLink} target='_blank' className='text-wrap font-medium text-blue-500'>
                {record.author.full_name}
              </Link> */}
            <p className='text-wrap font-medium text-black'>
              {record.author.full_name}
            </p>
          </Avatar.Group>
        )
      },
    },
    {
      title: '',
      key: 'actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: '40px',
      className: '!p-0',
      align: 'center',
      render: (_, data: IDocumentInResponse) => {
        const items: MenuProps['items'] = [
          {
            key: 'edit',
            label: <span style={{ color: '#3498db' }}>Sửa</span>,
            icon: <EditOutlined style={{ color: '#3498db' }} />,
          },
          {
            key: 'delete',
            label: 'Xóa',
            danger: true,
            icon: <DeleteOutlined />,
          },
        ]

        const handleMenuClick: MenuProps['onClick'] = (e) => {
          e.domEvent.stopPropagation()
          switch (e.key) {
            case 'edit':
              onClickUpdate(data.id)
              break
            case 'delete':
              onClickDelete(data.id)
              break
            default:
              break
          }
        }

        return (
          <Flex gap='small' wrap='wrap'>
            {userInfo &&
            (userInfo.roles.includes(data.role) || isSuperAdmin(true)) ? (
              <>
                <Dropdown
                  menu={{ items, onClick: handleMenuClick }}
                  placement='bottomRight'
                  trigger={['click']}
                >
                  <Button
                    type='text'
                    icon={<MoreOutlined rotate={90} />}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              </>
            ) : (
              <>--</>
            )}
          </Flex>
        )
      },
    },
  ]

  const onChangePagination = (pageIndex: number, pageSize: number) => {
    setTableQueries({ current: pageIndex, pageSize })
  }

  const onSearch = (val: string) => {
    setSearch(val)
  }
  const onChangType = (val: EDocumentType) => {
    setType(val)
  }
  const onChangeRole = (val: EAdminRole[]) => {
    setRoles(val)
  }
  const onChangeLabel = (val: string[]) => {
    setLabel(val)
  }

  const handleTableChange: TableProps<IDocumentInResponse>['onChange'] = (
    _pagination,
    _filters,
    sorter
  ) => {
    if (!isArray(sorter) && sorter?.order) {
      setSort(sorter.order as ESort)
      setSortBy(sorter.field as string)
    } else {
      setSort(undefined)
      setSortBy(undefined)
    }
  }

  return (
    <>
      <div className='mb-4 flex flex-wrap gap-3'>
        <Input.Search
          className='w-60'
          placeholder='Tìm kiếm'
          size='large'
          onSearch={onSearch}
          allowClear
        />
        <Select
          className='w-60'
          mode='multiple'
          size='large'
          placeholder='Lọc theo ban'
          filterOption={(input, option) =>
            isObject(option) &&
            (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
          }
          onChange={onChangeRole}
          value={roles}
          showSearch
          options={OPTIONS_ROLE}
          allowClear
          maxTagCount='responsive'
        />
        <Select
          className='w-60'
          size='large'
          placeholder='Lọc theo loại'
          onChange={onChangType}
          value={type}
          options={OPTIONS_DOCUMENT_TYPE}
          allowClear
          maxTagCount='responsive'
        />
        <Select
          className='w-60'
          mode='multiple'
          filterOption={(input, option) =>
            isObject(option) &&
            (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
          }
          size='large'
          placeholder='Lọc theo nhãn'
          onChange={onChangeLabel}
          value={label}
          options={OPTIONS_DOCUMENT_LABEL}
          showSearch
          allowClear
          maxTagCount='responsive'
        />
      </div>

      {userInfo &&
        (userInfo.roles.includes(EAdminRole.ADMIN) ||
          userInfo.latest_season === currentSeason?.season) && (
          <div className='mb-4 flex justify-end'>
            <Button
              type='primary'
              icon={<FileAddOutlined />}
              onClick={onClickAdd}
              size={'middle'}
            >
              Thêm
            </Button>
          </div>
        )}
      <Table
        showSorterTooltip={{ target: 'sorter-icon' }}
        onChange={handleTableChange}
        columns={columns}
        className='text-wrap'
        rowKey='id'
        pagination={false}
        dataSource={data?.data || []}
        loading={isLoading}
        scroll={{ x: 1500 }}
        bordered
      />
      <Pagination
        className='mt-4'
        total={paging.total}
        showTotal={(total, range) => (
          <span className='font-medium'>
            {range[0]}-{range[1]} của {total}
          </span>
        )}
        pageSize={tableQueries.pageSize}
        current={tableQueries.current}
        pageSizeOptions={PAGE_SIZE_OPTIONS_DEFAULT}
        onChange={onChangePagination}
        locale={{ items_per_page: '/ trang', jump_to: 'Tới trang', page: '' }}
        showQuickJumper
        showSizeChanger
      />
      {openForm && <ModalAdd open={openForm} setOpen={setOpenForm} />}
      {openEdit && <ModalUpdate open={openEdit} setOpen={setOpenEdit} />}
      {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} />}
    </>
  )
}

export default DocumentV
