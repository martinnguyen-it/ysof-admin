import { FileAddOutlined } from '@ant-design/icons'
import { ESort, IOpenForm, IOpenFormWithMode } from '@domain/common'
import { Button, Flex, Input, Pagination } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import type { TableProps } from 'antd'

import { FC, MouseEvent, useEffect, useReducer, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@atom/authAtom'
import { isArray, isEmpty } from 'lodash'
import dayjs from 'dayjs'
import { PAGE_SIZE_OPTIONS_DEFAULT, VN_TIMEZONE } from '@constants/index'
import ModalDelete from './ModalDelete'
import { currentSeasonState } from '@atom/seasonAtom'
import { isSuperAdmin } from '@src/utils'
import { EAdminRole } from '@domain/admin/type'
import { ILecturerInResponse } from '@domain/lecturer'
import { getListLecturers } from '@src/services/lecturer'
import ModalAdd from './ModalAdd'
import ModalView from './ModalView'

const LecturerV: FC = () => {
  const userInfo = useRecoilValue(userInfoState)
  const currentSeason = useRecoilValue(currentSeasonState)
  const [openForm, setOpenForm] = useState<IOpenFormWithMode<ILecturerInResponse>>({ active: false, mode: 'add' })
  const [openDel, setOpenDel] = useState<IOpenForm<string>>({ active: false })
  const [tableData, setTableData] = useState<ILecturerInResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [reloadData, setReloadData] = useReducer((prev) => !prev, false)

  const initPaging = {
    current: 1,
    pageSize: 20,
  }
  const [tableQueries, setTableQueries] = useState(initPaging)
  const [paging, setPaging] = useState({ total: 0, current: 1 })
  const [search, setSearch] = useState('')
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

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const res = await getListLecturers({ page_index: tableQueries.current, page_size: tableQueries.pageSize, search: search || undefined, sort, sort_by: sortBy })
      if (!isEmpty(res)) {
        setTableData(res.data)
        setPaging({ current: res.pagination.page_index, total: res.pagination.total })
      }
      setIsLoading(false)
    })()
  }, [reloadData, tableQueries, search, sort, sortBy])

  const columns: ColumnsType<ILecturerInResponse> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '60px',
      render: (_text, _record, index) => index + 1 + (paging.current - 1) * tableQueries.pageSize,
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
      title: 'Hành động',
      key: 'actions',
      dataIndex: 'actions',
      fixed: 'right',
      render: (_, data: ILecturerInResponse) => {
        return (
          <Flex gap='small' wrap='wrap'>
            <Button color='' type='primary' id={data.id} onClick={onClickUpdate} className='!bg-yellow-400 hover:opacity-80'>
              Sửa
            </Button>
            <Button type='primary' id={data.id} onClick={onClickDelete} danger>
              Xóa
            </Button>
          </Flex>
        )
      },
      hidden: !userInfo || !(userInfo.roles.includes(EAdminRole.BHV) || isSuperAdmin(true)),
    },
  ]

  const onChangePagination = (pageIndex: number, pageSize: number) => {
    setTableQueries({ current: pageIndex, pageSize })
  }

  const onSearch = (val: string) => {
    setSearch(val)
  }

  const handleTableChange: TableProps<ILecturerInResponse>['onChange'] = (_pagination, _filters, sorter) => {
    if (!isArray(sorter) && sorter?.order) {
      setSort(sorter.order as ESort)
      setSortBy(sorter.field as string)
    } else {
      setSort(undefined)
      setSortBy(undefined)
    }
  }

  return (
    <div className='m-5 rounded-xl bg-white p-6 shadow-lg'>
      <div className='mb-4 flex flex-wrap gap-3'>
        <Input.Search className='w-60' placeholder='Tìm kiếm' size='large' onSearch={onSearch} allowClear />
      </div>

      {userInfo && (userInfo.roles.includes(EAdminRole.ADMIN) || userInfo.current_season === currentSeason?.season) && (
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
      {openForm.active && openForm.mode !== 'view' && <ModalAdd open={openForm} setOpen={setOpenForm} setReloadData={setReloadData} />}
      {openForm.active && openForm.mode === 'view' && <ModalView open={openForm} setOpen={setOpenForm} />}
      {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} setReloadData={setReloadData} />}
    </div>
  )
}

export default LecturerV
