import { ESort } from '@domain/common'
import { Input, Select } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import type { TableProps } from 'antd'

import { FC, useEffect, useMemo, useState } from 'react'
import { isArray, size } from 'lodash'
import { ISubjectRegistrationInResponse } from '@domain/subject/subjectRegistration'
import dayjs from 'dayjs'
import { useGetListSubjects } from '@src/apis/subject/useQuerySubject'
import { useGetListSubjectRegistrations } from '@src/apis/subjectRegistration/useQuerySubjectRegistration'

const ListSubjectRegistrationV: FC = () => {
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

  useEffect(() => {
    setTableQueries(initPaging)
  }, [search])

  const { data, isLoading } = useGetListSubjectRegistrations({
    page_index: tableQueries.current,
    page_size: tableQueries.pageSize,
    search: search || undefined,
    sort,
    sort_by: sortBy,
    group,
  })

  useEffect(() => {
    if (data) {
      setPaging({ current: data.pagination.page_index, total: data.pagination.total })
    }
  }, [data])

  const { data: listSubject } = useGetListSubjects()

  const columns = useMemo(() => {
    const columns: ColumnsType<ISubjectRegistrationInResponse> = [
      {
        title: 'MSHV',
        dataIndex: ['student', 'numerical_order'],
        align: 'center',
        key: 'numerical_order',
        sorter: true,
        render: (_, record: ISubjectRegistrationInResponse) => String(record.student.seasons_info[record.student.seasons_info.length - 1].numerical_order).padStart(3, '0'),
      },
      {
        title: 'Nhóm',
        dataIndex: ['student', 'group'],
        align: 'center',
        key: 'group',
        sorter: true,
        render: (_, record: ISubjectRegistrationInResponse) => record.student.seasons_info[record.student.seasons_info.length - 1].group,
      },
      {
        title: 'Họ tên',
        dataIndex: ['student', 'full_name'],
        key: 'full_name',
        sorter: true,
        render: (_, record: ISubjectRegistrationInResponse) => (
          <>
            {record.student.holy_name} {record.student.full_name}
          </>
        ),
      },
      {
        title: 'Email',
        dataIndex: ['student', 'email'],
        key: 'email',
        sorter: true,
      },
      {
        title: 'Tổng',
        align: 'center',
        dataIndex: 'total',
        key: 'total',
      },
    ]
    if (listSubject && size(listSubject) > 0) {
      listSubject.forEach((item) => {
        columns.push({
          title: (
            <>
              {item.code} - {item.title} (<span className='italic'>{dayjs(item.start_at).format('DD-MM-YYYY')}</span>)
            </>
          ),
          dataIndex: item.code,
          key: item.code,
          width: '200px',
          align: 'center',
          render: (_, record: ISubjectRegistrationInResponse) => {
            const check = record.subject_registrations.includes(item.id)
            return <>{check ? 'x' : ''}</>
          },
          onCell: (record: ISubjectRegistrationInResponse) => {
            const check = record.subject_registrations.includes(item.id)
            return {
              className: check ? '' : '!bg-blue-100/30',
            }
          },
        })
      })
    }

    return columns
  }, [listSubject])

  const onSearch = (val: string) => {
    setSearch(val)
  }
  const onChangeGroup = (val: string) => {
    setGroup(val ? Number(val) : undefined)
  }

  const handleTableChange: TableProps<ISubjectRegistrationInResponse>['onChange'] = (_pagination, _filters, sorter) => {
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

      <div className='mb-4 flex items-center justify-between font-semibold'>{paging.total} học viên</div>
      <Table
        showSorterTooltip={{ target: 'sorter-icon' }}
        onChange={handleTableChange}
        columns={columns}
        className='text-wrap'
        rowKey={(record) => record.student.id}
        pagination={false}
        dataSource={data?.data}
        loading={isLoading}
        scroll={{ x: 2000 }}
        bordered
      />
    </div>
  )
}

export default ListSubjectRegistrationV
