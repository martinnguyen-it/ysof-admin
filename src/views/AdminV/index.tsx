import { FileAddOutlined } from '@ant-design/icons'
import { ESort, IOpenFormWithMode } from '@domain/common'
import { Button, Flex, Input, Pagination } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import type { TableProps } from 'antd'

import { FC, MouseEvent, useEffect, useReducer, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@atom/authAtom'
import { isArray, isEmpty } from 'lodash'
import dayjs from 'dayjs'
import { PAGE_SIZE_OPTIONS_DEFAULT } from '@constants/index'
import { selectSeasonState } from '@atom/seasonAtom'
import { isSuperAdmin } from '@src/utils'
import { EAdminRole, EAdminRoleDetail, IAdminInResponse } from '@domain/admin/type'
import { getListAdmins } from '@src/services/admin'
import ModalAdd from './ModalAdd'
// import ModalAdd from './ModalAdd'
// import ModalView from './ModalView'

const AdminV: FC = () => {
  const userInfo = useRecoilValue(userInfoState)
  const [openForm, setOpenForm] = useState<IOpenFormWithMode<IAdminInResponse>>({ active: false, mode: 'add' })
  const [tableData, setTableData] = useState<IAdminInResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // const [openDel, setOpenDel] = useState<IOpenForm<string>>({ active: false })
  const [reloadData, setReloadData] = useReducer((prev) => !prev, false)

  const initPaging = {
    current: 1,
    pageSize: 50,
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
    setOpenForm({ active: true, mode: 'update', item })
  }

  // const onClickDelete = (e: MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation()
  //   setOpenDel({ active: true, item: e.currentTarget.id })
  // }

  useEffect(() => {
    setTableQueries(initPaging)
  }, [search])

  const season = useRecoilValue(selectSeasonState)
  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const res = await getListAdmins({ page_index: tableQueries.current, page_size: tableQueries.pageSize, search: search || undefined, sort, sort_by: sortBy, season })
      if (!isEmpty(res)) {
        setTableData(res.data)
        setPaging({ current: res.pagination.page_index, total: res.pagination.total })
      }
      setIsLoading(false)
    })()
  }, [reloadData, tableQueries, search, sort, sortBy, season])

  const columns: ColumnsType<IAdminInResponse> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: '60px',
      render: (_text, _record, index) => index + 1 + (paging.current - 1) * tableQueries.pageSize,
    },
    {
      title: 'Họ tên',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: true,
      render: (_, record: IAdminInResponse) => (
        <>
          {record.holy_name} {record.full_name}
        </>
      ),
    },
    {
      title: 'Thuộc ban',
      dataIndex: 'roles',
      key: 'roles',
      render: (text: EAdminRole[]) => text.map((item) => EAdminRoleDetail[item]).join(', '),
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      sorter: true,
      render: (text) => <>{text ? dayjs(text).format('DD-MM-YYYY') : ''}</>,
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
      title: 'Hành động',
      key: 'actions',
      dataIndex: 'actions',
      fixed: 'right',
      render: (_, data: IAdminInResponse) => {
        return (
          <Flex gap='small' wrap='wrap'>
            <Button color='' type='primary' id={data.id} onClick={onClickUpdate} className='!bg-yellow-400 hover:opacity-80'>
              Sửa
            </Button>
            {/* <Button type='primary' id={data.id} onClick={onClickDelete} danger>
              Xóa
            </Button> */}
          </Flex>
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

  const handleTableChange: TableProps<IAdminInResponse>['onChange'] = (_pagination, _filters, sorter) => {
    if (!isArray(sorter) && sorter?.order) {
      const field = sorter.field && (isArray(sorter.field) ? sorter.field.join('.') : sorter.field)
      setSort(sorter.order as ESort)
      setSortBy(field as string)
    } else {
      setSort(undefined)
      setSortBy(undefined)
    }
  }

  return (
    <div className='min-h-[calc(100vh-48px)] bg-[#d8ecef42] p-6 shadow-lg'>
      <div className='mb-4 flex flex-wrap gap-3'>
        <Input.Search className='w-60' placeholder='Tìm kiếm' size='large' onSearch={onSearch} allowClear />
      </div>

      {userInfo && isSuperAdmin(true) && (
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
      {/* {openForm.active && openForm.mode === 'view' && <ModalView open={openForm} setOpen={setOpenForm} />} */}
      {/* {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} setReloadData={setReloadData} />} */}
    </div>
  )
}

export default AdminV
