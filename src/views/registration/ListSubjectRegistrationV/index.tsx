import { FC, useEffect, useMemo, useState } from 'react'
import { useGetListSubjects } from '@/apis/subject/useQuerySubject'
import { useGetListSubjectRegistrations } from '@/apis/subjectRegistration/useQuerySubjectRegistration'
import { userInfoState } from '@/atom/authAtom'
import { currentSeasonState } from '@/atom/seasonAtom'
import { EAdminRole } from '@/domain/admin/type'
import { ESort, IOpenForm } from '@/domain/common'
import { ISubjectRegistrationInResponse } from '@/domain/subject/subjectRegistration'
import { FileAddOutlined, PlusOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import { Button, Input, Select } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { isArray, isEmpty, size } from 'lodash'
import { useRecoilValue } from 'recoil'
import { hasMatch, isSuperAdmin } from '@/lib/utils'
import ModalAdd from './ModalAdd'

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
  const [openForm, setOpenForm] = useState<Required<IOpenForm<string>>>({
    active: false,
    item: '',
  })

  const userInfo = useRecoilValue(userInfoState)
  const currentSeason = useRecoilValue(currentSeasonState)

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
      setPaging({
        current: data.pagination.page_index,
        total: data.pagination.total,
      })
    }
  }, [data])

  const { data: listSubject = [] } = useGetListSubjects()

  const columns = useMemo(() => {
    const columns: ColumnsType<ISubjectRegistrationInResponse> = [
      {
        title: 'MSHV',
        dataIndex: ['student', 'numerical_order'],
        align: 'center',
        key: 'numerical_order',
        sorter: true,
        render: (_, record: ISubjectRegistrationInResponse) =>
          String(
            record.student.seasons_info[record.student.seasons_info.length - 1]
              .numerical_order
          ).padStart(3, '0'),
      },
      {
        title: 'Nhóm',
        dataIndex: ['student', 'group'],
        align: 'center',
        key: 'group',
        sorter: true,
        render: (_, record: ISubjectRegistrationInResponse) =>
          record.student.seasons_info[record.student.seasons_info.length - 1]
            .group,
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
      {
        title: '',
        key: 'actions',
        dataIndex: 'actions',
        width: '60px',
        className: '!p-0',
        align: 'center',
        render: (_, record: ISubjectRegistrationInResponse) => {
          return (
            <Button
              type='text'
              icon={<PlusOutlined />}
              onClick={() => onClickAdd(record.student.id)}
              title='Cập nhật đăng ký'
              size='small'
            />
          )
        },
        hidden:
          !userInfo ||
          !(
            (userInfo?.latest_season === currentSeason?.season &&
              hasMatch(userInfo.roles, [EAdminRole.BHV, EAdminRole.BKL])) ||
            isSuperAdmin(true)
          ),
      },
    ]
    if (size(listSubject) > 0) {
      listSubject.forEach((item) => {
        columns.push({
          title: (
            <>
              {item.code} - {item.title} (
              <span className='italic'>
                {dayjs(item.start_at).format('DD-MM-YYYY')}
              </span>
              )
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

  const onClickAdd = (studentId?: string) => {
    setOpenForm({ active: true, item: studentId || '' })
  }

  const handleTableChange: TableProps<ISubjectRegistrationInResponse>['onChange'] =
    (_pagination, _filters, sorter) => {
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

      <div className='mb-4 flex items-center justify-between font-semibold'>
        <p>{paging.total} học viên</p>
        {userInfo &&
          ((userInfo?.latest_season === currentSeason?.season &&
            hasMatch(userInfo.roles, [EAdminRole.BHV, EAdminRole.BKL])) ||
            isSuperAdmin(true)) && (
            <Button
              type='primary'
              icon={<FileAddOutlined />}
              onClick={() => onClickAdd()}
              size={'middle'}
            >
              Cập nhật đăng ký
            </Button>
          )}
      </div>
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
        summary={() => {
          let index = 0
          return !isEmpty(data?.summary) && !!size(listSubject) ? (
            <Table.Summary.Row className='bg-yellow-100/30 font-bold'>
              <Table.Summary.Cell index={0} align='center' colSpan={6}>
                Thống kê
              </Table.Summary.Cell>
              {listSubject.map((item) => (
                <Table.Summary.Cell index={++index} align='center' colSpan={1}>
                  {data.summary[item.id] || 0}
                </Table.Summary.Cell>
              ))}
            </Table.Summary.Row>
          ) : null
        }}
      />

      {openForm.active && <ModalAdd open={openForm} setOpen={setOpenForm} />}
    </>
  )
}

export default ListSubjectRegistrationV
