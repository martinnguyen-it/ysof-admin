import { FC, MouseEvent, useEffect, useState } from 'react'
import { useGetListAdmins } from '@/apis/admin/useQueryAdmin'
import { userInfoState } from '@/atom/authAtom'
import { selectSeasonState } from '@/atom/seasonAtom'
import {
  EAdminRole,
  EAdminRoleDetail,
  IAdminInResponse,
} from '@/domain/admin/type'
import { ESort, IOpenFormWithMode } from '@/domain/common'
import { EditOutlined, FileAddOutlined, MoreOutlined } from '@ant-design/icons'
import type { MenuProps, TableProps } from 'antd'
import { Avatar, Button, Dropdown, Input, Pagination } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { isArray } from 'lodash'
import { useRecoilValue } from 'recoil'
import { isSuperAdmin } from '@/lib/utils'
import { PAGE_SIZE_OPTIONS_DEFAULT } from '@/constants/index'
import ModalAdd from './ModalAdd'
import ModalView from './ModalView'

// import ModalAdd from './ModalAdd'
// import ModalView from './ModalView'

const AdminV: FC = () => {
  const userInfo = useRecoilValue(userInfoState)
  const [openForm, setOpenForm] = useState<IOpenFormWithMode<IAdminInResponse>>(
    { active: false, mode: 'add' }
  )
  // const [openDel, setOpenDel] = useState<IOpenForm<string>>({ active: false })

  const initPaging = {
    current: 1,
    pageSize: 50,
  }
  const [tableQueries, setTableQueries] = useState(initPaging)
  const [paging, setPaging] = useState({ total: 0, current: 1 })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<ESort>(ESort.ASCE)
  const [sortBy, setSortBy] = useState<string>('roles')

  useEffect(() => {
    setTableQueries(initPaging)
  }, [search])

  const season = useRecoilValue(selectSeasonState)

  const { data, isLoading } = useGetListAdmins({
    page_index: tableQueries.current,
    page_size: tableQueries.pageSize,
    search: search || undefined,
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
    setOpenForm({ active: true, mode: 'add' })
  }

  const onClickUpdate = (id: string) => {
    const item = data?.data.find((val) => val.id === id)
    setOpenForm({ active: true, mode: 'update', item })
  }

  // const onClickDelete = (e: MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation()
  //   setOpenDel({ active: true, item: e.currentTarget.id })
  // }

  const columns: ColumnsType<IAdminInResponse> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: '60px',
      render: (_text, _record, index) =>
        index + 1 + (paging.current - 1) * tableQueries.pageSize,
    },
    {
      title: 'Họ tên',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: true,
      render: (_, record: IAdminInResponse) => (
        <Avatar.Group className='flex items-center'>
          <img
            className='mr-4 size-7 rounded-full object-cover'
            referrerPolicy='no-referrer'
            src={record.avatar || '/images/avatar.png'}
          />
          {/* <Link to={record.webViewLink} target='_blank' className='text-wrap font-medium text-blue-500'>
            {record.author.full_name}
          </Link> */}
          <p className='text-wrap font-medium text-black'>
            {record.holy_name} {record.full_name}
          </p>
        </Avatar.Group>
      ),
    },
    {
      title: 'Thuộc ban',
      dataIndex: 'roles',
      key: 'roles',
      sorter: true,
      render: (text: EAdminRole[]) =>
        text.map((item) => EAdminRoleDetail[item]).join(', '),
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      sorter: true,
      render: (text) => <>{text ? dayjs(text).format('DD-MM-YYYY') : ''}</>,
    },
    {
      title: 'Ngày bổn mạng',
      dataIndex: 'patronal_day',
      key: 'patronal_day',
      sorter: true,
    },
    {
      title: 'Giáo phận',
      dataIndex: ['address', 'diocese'],
      key: 'diocese',
      sorter: true,
    },
    {
      title: 'Nơi ở hiện tại',
      dataIndex: ['address', 'current'],
      key: 'current',
      sorter: true,
    },
    {
      title: 'Quê quán',
      dataIndex: ['address', 'original'],
      key: 'original',
      sorter: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (text) => <>{isArray(text) ? text.join(', ') : ''}</>,
    },
    {
      title: 'Địa chỉ email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'Facebook',
      dataIndex: 'facebook',
      key: 'facebook',
      sorter: true,
    },
    {
      title: '',
      key: 'actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: '40px',
      className: '!p-0',
      align: 'center',
      render: (_, data: IAdminInResponse) => {
        const items: MenuProps['items'] = [
          {
            key: 'edit',
            label: <span style={{ color: '#3498db' }}>Sửa</span>,
            icon: <EditOutlined style={{ color: '#3498db' }} />,
          },
        ]

        const handleMenuClick: MenuProps['onClick'] = (e) => {
          e.domEvent.stopPropagation()
          switch (e.key) {
            case 'edit':
              onClickUpdate(data.id)
              break
            default:
              break
          }
        }

        return (
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
        )
      },
      hidden: !(userInfo && isSuperAdmin(true)),
    },
  ]

  const onChangePagination = (pageIndex: number, pageSize: number) => {
    setTableQueries({ current: pageIndex, pageSize })
  }

  const onSearch = (val: string) => {
    setSearch(val)
  }

  const handleTableChange: TableProps<IAdminInResponse>['onChange'] = (
    _pagination,
    _filters,
    sorter
  ) => {
    if (!isArray(sorter) && sorter?.order) {
      const field =
        sorter.field &&
        (isArray(sorter.field) ? sorter.field.join('.') : sorter.field)
      setSort(sorter.order as ESort)
      setSortBy(field as string)
    } else {
      setSort(ESort.ASCE)
      setSortBy('roles')
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
      </div>

      {userInfo && isSuperAdmin(true) && (
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
        onRow={(record) => {
          return {
            onClick: () => {
              setOpenForm({ active: true, mode: 'view', item: record })
            },
          }
        }}
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
      {openForm.active && openForm.mode !== 'view' && (
        <ModalAdd open={openForm} setOpen={setOpenForm} />
      )}
      {openForm.active && openForm.mode === 'view' && (
        <ModalView open={openForm} setOpen={setOpenForm} />
      )}
      {/* {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} setReloadData={setReloadData} />} */}
    </>
  )
}

export default AdminV
