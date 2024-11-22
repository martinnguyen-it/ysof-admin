import { FileAddOutlined, ImportOutlined } from '@ant-design/icons'
import { ESort, IOpenForm, IOpenFormWithMode } from '@domain/common'
import { Button, Flex, Input, Pagination, Select } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import type { TableProps } from 'antd'

import { FC, MouseEvent, useEffect, useReducer, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@atom/authAtom'
import { isArray, isEmpty } from 'lodash'
import dayjs from 'dayjs'
import { PAGE_SIZE_OPTIONS_DEFAULT } from '@constants/index'
import ModalDelete from './ModalDelete'
import { currentSeasonState } from '@atom/seasonAtom'
import { isSuperAdmin } from '@src/utils'
import { EAdminRole } from '@domain/admin/type'
import { IStudentInResponse } from '@domain/student'
import { getListStudents } from '@src/services/student'
import ModalAdd from './ModalAdd'
import ModalImport from './ModalImport'
// import ModalView from './ModalView'

const StudentV: FC = () => {
  const userInfo = useRecoilValue(userInfoState)
  const currentSeason = useRecoilValue(currentSeasonState)
  const [openForm, setOpenForm] = useState<IOpenFormWithMode<IStudentInResponse>>({ active: false, mode: 'add' })
  const [openDel, setOpenDel] = useState<IOpenForm<string>>({ active: false })
  const [openImport, setOpenImport] = useState(false)
  const [tableData, setTableData] = useState<IStudentInResponse[]>([])
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
  const [group, setGroup] = useState<number>()

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

  const onClickImport = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setOpenImport(true)
  }

  useEffect(() => {
    setTableQueries(initPaging)
  }, [search])

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const res = await getListStudents({ page_index: tableQueries.current, page_size: tableQueries.pageSize, search: search || undefined, sort, sort_by: sortBy, group })
      if (!isEmpty(res)) {
        setTableData(res.data)
        setPaging({ current: res.pagination.page_index, total: res.pagination.total })
      }
      setIsLoading(false)
    })()
  }, [reloadData, tableQueries, search, sort, sortBy, group])

  const columns: ColumnsType<IStudentInResponse> = [
    {
      title: 'MSHV',
      dataIndex: 'numerical_order',
      key: 'numerical_order',
      width: '80px',
      sorter: true,
      render: (_, record: IStudentInResponse) => String(record.seasons_info[record.seasons_info.length - 1].numerical_order).padStart(3, '0'),
    },
    {
      title: 'Nhóm',
      dataIndex: 'group',
      key: 'group',
      sorter: true,
      width: '80px',
      render: (_, record: IStudentInResponse) => record.seasons_info[record.seasons_info.length - 1].group,
    },
    {
      title: 'Họ tên',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: true,
      render: (_, record: IStudentInResponse) => (
        <>
          {record.holy_name} {record.full_name}
        </>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'sex',
      key: 'sex',
      sorter: true,
      width: '110px',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      sorter: true,
      render: (text) => <>{dayjs(text).format('DD-MM-YYYY')}</>,
    },
    {
      title: 'Quê quán',
      dataIndex: 'origin_address',
      key: 'origin_address',
      sorter: true,
    },
    {
      title: 'Giáo phận đang sinh hoạt',
      dataIndex: 'diocese',
      key: 'diocese',
      width: '140px',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
      sorter: true,
    },
    {
      title: 'Học vấn',
      dataIndex: 'education',
      key: 'education',
      sorter: true,
    },
    {
      title: 'Nghề nghiệp',
      dataIndex: 'job',
      key: 'job',
      sorter: true,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      sorter: true,
    },
    {
      title: 'Hành động',
      key: 'actions',
      dataIndex: 'actions',
      fixed: 'right',
      render: (_, data: IStudentInResponse) => {
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
      hidden: !userInfo || !((userInfo.roles.includes(EAdminRole.BKL) && userInfo.latest_season != currentSeason.season) || isSuperAdmin(true)),
    },
  ]

  const onChangePagination = (pageIndex: number, pageSize: number) => {
    setTableQueries({ current: pageIndex, pageSize })
  }

  const onSearch = (val: string) => {
    setSearch(val)
  }
  const onChangeGroup = (val: string) => {
    setGroup(val ? Number(val) : undefined)
  }

  const handleTableChange: TableProps<IStudentInResponse>['onChange'] = (_pagination, _filters, sorter) => {
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
          options={Array.from({ length: 15 }, (_, index) => ({
            value: String(index + 1),
            label: String(index + 1),
          }))}
          className='w-60'
          placeholder='Nhóm'
          size='large'
          onChange={onChangeGroup}
          showSearch
          allowClear
        />
      </div>

      <div className='flex items-center justify-between'>
        <Pagination
          className='mb-4'
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
        {userInfo && ((userInfo.latest_season === currentSeason.season && userInfo.roles.includes(EAdminRole.BKL)) || isSuperAdmin(true)) && (
          <div className='mb-4 flex justify-end gap-3'>
            <Button type='primary' icon={<FileAddOutlined />} onClick={onClickAdd} size={'middle'}>
              Thêm
            </Button>
            <Button type='primary' icon={<ImportOutlined />} onClick={onClickImport} size={'middle'}>
              Import từ Google Spreadsheet
            </Button>
          </div>
        )}
      </div>
      <Table
        showSorterTooltip={{ target: 'sorter-icon' }}
        onChange={handleTableChange}
        columns={columns}
        className='text-wrap'
        rowKey='id'
        pagination={false}
        dataSource={tableData}
        loading={isLoading}
        scroll={{ x: 2000 }}
        bordered
        onRow={(record) => {
          return {
            onClick: () => {
              setOpenForm({ active: true, mode: 'view', item: record })
            },
          }
        }}
      />

      {openForm.active && openForm.mode !== 'view' && <ModalAdd open={openForm} setOpen={setOpenForm} setReloadData={setReloadData} />}
      {/* {openForm.active && openForm.mode === 'view' && <ModalView open={openForm} setOpen={setOpenForm} />} */}
      <ModalImport open={openImport} setOpen={setOpenImport} setReloadData={setReloadData} />
      {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} setReloadData={setReloadData} />}
    </div>
  )
}

export default StudentV
