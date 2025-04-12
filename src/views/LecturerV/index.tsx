import { FC, MouseEvent, useEffect, useState } from 'react'
import { useGetListLecturers } from '@/apis/lecturer/useQueryLecturer'
import { userInfoState } from '@/atom/authAtom'
import { currentSeasonState, selectSeasonState } from '@/atom/seasonAtom'
import { EAdminRole } from '@/domain/admin/type'
import { ESort, IOpenForm, IOpenFormWithMode } from '@/domain/common'
import { ILecturerInResponse } from '@/domain/lecturer'
import {
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import type { MenuProps, TableProps } from 'antd'
import { Button, Dropdown, Input, Pagination } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { isArray } from 'lodash'
import { useRecoilValue } from 'recoil'
import { isSuperAdmin } from '@/lib/utils'
import { PAGE_SIZE_OPTIONS_DEFAULT, VN_TIMEZONE } from '@/constants/index'
import ModalAdd from './ModalAdd'
import ModalDelete from './ModalDelete'
import ModalView from './ModalView'

const LecturerV: FC = () => {
  const userInfo = useRecoilValue(userInfoState)
  const currentSeason = useRecoilValue(currentSeasonState)
  const [openForm, setOpenForm] = useState<
    IOpenFormWithMode<ILecturerInResponse>
  >({ active: false, mode: 'add' })
  const [openDel, setOpenDel] = useState<IOpenForm<string>>({ active: false })

  const initPaging = {
    current: 1,
    pageSize: 20,
  }
  const [tableQueries, setTableQueries] = useState(initPaging)
  const [paging, setPaging] = useState({ total: 0, current: 1 })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<ESort>()
  const [sortBy, setSortBy] = useState<string>()

  const season = useRecoilValue(selectSeasonState)

  const { data, isLoading } = useGetListLecturers({
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
    setOpenForm({ active: true, mode: 'add', item })
  }

  const onClickDelete = (id: string) => {
    setOpenDel({ active: true, item: id })
  }

  useEffect(() => {
    setTableQueries(initPaging)
  }, [search])

  const columns: ColumnsType<ILecturerInResponse> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '60px',
      render: (_text, _record, index) =>
        index + 1 + (paging.current - 1) * tableQueries.pageSize,
    },
    {
      title: 'Họ tên',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: true,
      render: (_, record: ILecturerInResponse) => (
        <>
          {record?.title ? record.title + ' ' : ''}
          {record?.holy_name ? record.holy_name + ' ' : ''}
          {record.full_name}
        </>
      ),
    },
    {
      title: 'Thông tin cơ bản',
      dataIndex: 'information',
      key: 'information',
      render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
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
      title: '',
      key: 'actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: '40px',
      className: '!p-0',
      align: 'center',
      render: (_, data: ILecturerInResponse) => {
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
      hidden:
        !userInfo ||
        !(userInfo.roles.includes(EAdminRole.BHV) || isSuperAdmin(true)),
    },
  ]

  const onChangePagination = (pageIndex: number, pageSize: number) => {
    setTableQueries({ current: pageIndex, pageSize })
  }

  const onSearch = (val: string) => {
    setSearch(val)
  }

  const handleTableChange: TableProps<ILecturerInResponse>['onChange'] = (
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
      </div>

      {userInfo &&
        ((userInfo.latest_season === currentSeason.season &&
          userInfo.roles.includes(EAdminRole.BHV)) ||
          isSuperAdmin(true)) && (
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
        scroll={{ x: 800 }}
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
      {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} />}
    </>
  )
}

export default LecturerV
