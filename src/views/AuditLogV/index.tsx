import { ESort, IOpenFormWithMode } from '@domain/common'
import { Input, Pagination, Select } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import type { TableProps } from 'antd'

import { FC, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { isArray, isEmpty, isObject } from 'lodash'
import dayjs from 'dayjs'
import { PAGE_SIZE_OPTIONS_DEFAULT, VN_TIMEZONE } from '@constants/index'
import { selectSeasonState } from '@atom/seasonAtom'
import ModalView from './ModalView'
import { EAuditLogEndPoint, EAuditLogType, IAuditLogInResponse } from '@domain/auditLog'
import { getListAuditLogs } from '@src/services/auditLog'
import { EAdminRole, EAdminRoleDetail } from '@domain/admin/type'
import { OPTIONS_AUDIT_LOG_ENDPOINT, OPTIONS_AUDIT_LOG_TYPE } from '@constants/auditLog'

const AuditLogV: FC = () => {
  const [openForm, setOpenForm] = useState<IOpenFormWithMode<IAuditLogInResponse>>({ active: false, mode: 'view' })
  const [tableData, setTableData] = useState<IAuditLogInResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const initPaging = {
    current: 1,
    pageSize: 20,
  }
  const [tableQueries, setTableQueries] = useState(initPaging)
  const [paging, setPaging] = useState({ total: 0, current: 1 })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<ESort>()
  const [sortBy, setSortBy] = useState<string>()
  const [type, setType] = useState<EAuditLogType>()
  const [endpoint, setEndpoint] = useState<EAuditLogEndPoint>()

  useEffect(() => {
    setTableQueries(initPaging)
  }, [search])

  const season = useRecoilValue(selectSeasonState)
  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const res = await getListAuditLogs({ page_index: tableQueries.current, page_size: tableQueries.pageSize, search: search || undefined, sort, sort_by: sortBy, type, endpoint })
      if (!isEmpty(res)) {
        setTableData(res.data)
        setPaging({ current: res.pagination.page_index, total: res.pagination.total })
      }
      setIsLoading(false)
    })()
  }, [tableQueries, search, sort, sortBy, season, type, endpoint])

  const columns: ColumnsType<IAuditLogInResponse> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '60px',
      render: (_text, _record, index) => index + 1 + (paging.current - 1) * tableQueries.pageSize,
    },
    {
      title: 'Họ tên',
      dataIndex: 'author_name',
      key: 'author_name',
      sorter: true,
      render: (_, record: IAuditLogInResponse) => <>{record?.author ? record.author.holy_name + ' ' + record.author.full_name : record.author_name}</>,
    },
    {
      title: 'Thuộc ban',
      dataIndex: 'author_roles',
      sorter: true,
      key: 'author_roles',
      render: (text: EAdminRole[]) => text.map((item) => EAdminRoleDetail[item]).join(', '),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      sorter: true,
    },
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint',
      sorter: true,
    },
    {
      title: 'Chi tiết',
      dataIndex: 'description',
      key: 'description',
      width: '400px',
      render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      render: (text) => <>{dayjs.utc(text).tz(VN_TIMEZONE).format('HH:mm DD-MM-YYYY')}</>,
    },
  ]

  const onChangePagination = (pageIndex: number, pageSize: number) => {
    setTableQueries({ current: pageIndex, pageSize })
  }

  const onSearch = (val: string) => {
    setSearch(val)
  }
  const onChangeType = (val: EAuditLogType) => {
    setType(val)
  }
  const onChangeEndpoint = (val: EAuditLogEndPoint) => {
    setEndpoint(val)
  }

  const handleTableChange: TableProps<IAuditLogInResponse>['onChange'] = (_pagination, _filters, sorter) => {
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
          size='large'
          placeholder='Lọc theo endpoint'
          onChange={onChangeEndpoint}
          filterOption={(input, option) =>
            isObject(option) && (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
          }
          value={endpoint}
          options={OPTIONS_AUDIT_LOG_ENDPOINT}
          allowClear
          showSearch
        />
        <Select className='w-60' size='large' placeholder='Lọc theo loại' onChange={onChangeType} value={type} options={OPTIONS_AUDIT_LOG_TYPE} allowClear showSearch />
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
        scroll={{ x: 1200 }}
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
      {openForm.active && <ModalView open={openForm} setOpen={setOpenForm} />}
    </div>
  )
}

export default AuditLogV
