import { FileAddOutlined } from '@ant-design/icons'
import { ESort, IOpenForm, IOpenFormWithMode } from '@domain/common'
import { Avatar, Button, Flex, Input, Pagination, Select, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import type { TableProps } from 'antd'

import { FC, MouseEvent, useEffect, useReducer, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@atom/authAtom'
import { isArray, isEmpty, isObject } from 'lodash'
import dayjs from 'dayjs'
import { OPTIONS_ROLE, PAGE_SIZE_OPTIONS_DEFAULT, VN_TIMEZONE } from '@constants/index'
import ModalDelete from './ModalDelete'
import { currentSeasonState, selectSeasonState } from '@atom/seasonAtom'
import { isSuperAdmin } from '@src/utils'
import { getListGeneralTasks } from '@src/services/generalTask'
import { EGeneralTaskType, IGeneralTaskInResponse } from '@domain/generalTask'
import { EAdminRole, EAdminRoleDetail } from '@domain/admin/type'
import { EGeneralTaskTypeDetail, OPTIONS_GENERAL_TASK_LABEL, OPTIONS_GENERAL_TASK_TYPE } from '@constants/generalTask'
import ModalAdd from './ModalAdd'
import ModalView from './ModalView'

const GeneralTaskV: FC = () => {
  const userInfo = useRecoilValue(userInfoState)
  const currentSeason = useRecoilValue(currentSeasonState)
  const [openForm, setOpenForm] = useState<IOpenFormWithMode<IGeneralTaskInResponse>>({ active: false, mode: 'add' })
  const [openDel, setOpenDel] = useState<IOpenForm<string>>({ active: false })
  const [tableData, setTableData] = useState<IGeneralTaskInResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [reloadData, setReloadData] = useReducer((prev) => !prev, false)

  const initPaging = {
    current: 1,
    pageSize: 20,
  }
  const [tableQueries, setTableQueries] = useState(initPaging)
  const [paging, setPaging] = useState({ total: 0, current: 1 })
  const [search, setSearch] = useState('')
  const [roles, setRoles] = useState<EAdminRole[]>([])
  const [type, setType] = useState<EGeneralTaskType>()
  const [label, setLabel] = useState<string[]>()
  const [sort, setSort] = useState<ESort>()
  const [sortBy, setSortBy] = useState<string>()

  const onClickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setOpenForm({ active: true, mode: 'add' })
  }

  const onClickUpdate = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const item = tableData.find((val) => val.id === e.currentTarget.id)
    setOpenForm({ active: true, mode: 'add', item })
  }

  const onClickDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setOpenDel({ active: true, item: e.currentTarget.id })
  }

  useEffect(() => {
    setTableQueries(initPaging)
  }, [search])

  const season = useRecoilValue(selectSeasonState)
  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const res = await getListGeneralTasks({ page_index: tableQueries.current, page_size: tableQueries.pageSize, search, roles, type, label, sort, sort_by: sortBy, season })
      if (!isEmpty(res)) {
        setTableData(res.data)
        setPaging({ current: res.pagination.page_index, total: res.pagination.total })
      }
      setIsLoading(false)
    })()
  }, [reloadData, tableQueries, search, roles, type, label, sort, sortBy, season])

  const columns: ColumnsType<IGeneralTaskInResponse> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '60px',
      render: (_text, _record, index) => index + 1 + (paging.current - 1) * tableQueries.pageSize,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      sorter: true,
      key: 'title',
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
      render: (text: EGeneralTaskType) => EGeneralTaskTypeDetail[text],
    },
    {
      title: 'Nhãn tài liệu',
      dataIndex: 'label',
      key: 'label',
      render: (text: string[]) => text.join(', '),
    },
    {
      title: 'Mô tả ngắn',
      dataIndex: 'short_desc',
      key: 'short_desc',
      render: (text: string) => <span className='text-wrap italic'>{text}</span>,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_at',
      key: 'start_at',
      sorter: true,
      render: (text) => <>{dayjs(text).format('DD-MM-YYYY')}</>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      render: (text) => <>{dayjs.utc(text).tz(VN_TIMEZONE).format('HH:mm DD-MM-YYYY')}</>,
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: true,
      render: (text) => <>{dayjs.utc(text).tz(VN_TIMEZONE).format('HH:mm DD-MM-YYYY')}</>,
    },
    {
      title: 'Người tạo',
      dataIndex: 'name',
      sorter: true,
      key: 'name',
      width: '150px',
      render: (_, record: IGeneralTaskInResponse) => {
        return (
          <Avatar.Group className='flex items-center'>
            <img className='mr-4 size-7 object-cover' src={record.author.avatar || '/images/avatar.png'}></img>
            <Tooltip placement='bottom' title='Nhấn vào đây để xem file'>
              {/* <Link to={record.webViewLink} target='_blank' className='text-wrap font-medium text-blue-500'>
                {record.author.full_name}
              </Link> */}
              <p className='text-wrap font-medium text-black'>{record.author.full_name}</p>
            </Tooltip>
          </Avatar.Group>
        )
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      dataIndex: 'actions',
      fixed: 'right',
      render: (_, data: IGeneralTaskInResponse) => {
        return (
          <Flex gap='small' wrap='wrap'>
            {userInfo && (userInfo.roles.includes(data.role) || isSuperAdmin(true)) ? (
              <>
                <Button color='' type='primary' id={data.id} onClick={onClickUpdate} className='!bg-yellow-400 hover:opacity-80'>
                  Sửa
                </Button>
                <Button type='primary' id={data.id} onClick={onClickDelete} danger>
                  Xóa
                </Button>
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
  const onChangType = (val: EGeneralTaskType) => {
    setType(val)
  }
  const onChangeRole = (val: EAdminRole[]) => {
    setRoles(val)
  }
  const onChangeLabel = (val: string[]) => {
    setLabel(val)
  }

  const handleTableChange: TableProps<IGeneralTaskInResponse>['onChange'] = (_pagination, _filters, sorter) => {
    if (!isArray(sorter) && sorter?.order) {
      setSort(sorter.order as ESort)
      setSortBy(sorter.field as string)
    } else {
      setSort(undefined)
      setSortBy(undefined)
    }
  }

  return (
    <div className='min-h-[calc(100vh-48px)] bg-[#d8ecef42] p-6 shadow-lg'>
      <div className='mb-4 flex flex-wrap gap-3'>
        <Input.Search className='w-60' placeholder='Tìm kiếm' size='large' onSearch={onSearch} allowClear />
        <Select
          className='w-60'
          mode='multiple'
          size='large'
          placeholder='Lọc theo ban'
          filterOption={(input, option) =>
            isObject(option) && (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
          }
          onChange={onChangeRole}
          value={roles}
          options={OPTIONS_ROLE}
          showSearch
          allowClear
          maxTagCount='responsive'
        />
        <Select
          className='w-60'
          size='large'
          placeholder='Lọc theo loại'
          onChange={onChangType}
          value={type}
          options={OPTIONS_GENERAL_TASK_TYPE}
          allowClear
          maxTagCount='responsive'
        />
        <Select
          className='w-60'
          mode='multiple'
          size='large'
          placeholder='Lọc theo nhãn'
          filterOption={(input, option) =>
            isObject(option) && (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
          }
          onChange={onChangeLabel}
          value={label}
          options={OPTIONS_GENERAL_TASK_LABEL}
          showSearch
          allowClear
          maxTagCount='responsive'
        />
      </div>

      {userInfo && (userInfo.roles.includes(EAdminRole.ADMIN) || userInfo.latest_season === currentSeason?.season) && (
        <div className='mb-4 flex justify-end'>
          <Button type='primary' icon={<FileAddOutlined />} onClick={onClickAdd} size={'middle'}>
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
        dataSource={tableData}
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
      {openForm.active && openForm.mode !== 'view' && <ModalAdd open={openForm} setOpen={setOpenForm} setReloadData={setReloadData} />}
      {openForm.active && openForm.mode === 'view' && <ModalView open={openForm} setOpen={setOpenForm} />}
      {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} setReloadData={setReloadData} />}
    </div>
  )
}

export default GeneralTaskV
