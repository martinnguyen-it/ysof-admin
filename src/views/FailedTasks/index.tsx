import { FC, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGetListFailedTask,
  useMarkResolvedFailedTasks,
  useUndoMarkResolvedFailedTasks,
} from '@/apis/failedTasks/useFailedTasks'
import { ESort, IOpenFormWithMode } from '@/domain/common'
import { EFailedTaskTag, IFailedTask } from '@/domain/failedTasks'
import type { TableProps } from 'antd'
import { Button, Input, Pagination, Select, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { isArray, isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import {
  OPTIONS_FAILED_TASK_STATUS,
  OPTIONS_FAILED_TASK_TAG,
} from '@/constants/failedTasks'
import { PAGE_SIZE_OPTIONS_DEFAULT, VN_TIMEZONE } from '@/constants/index'
import ModalView from './ModalView'

const FailedTasks: FC = () => {
  const [openForm, setOpenForm] = useState<IOpenFormWithMode<IFailedTask>>({
    active: false,
    mode: 'view',
  })

  const initPaging = {
    current: 1,
    pageSize: 20,
  }
  const [tableQueries, setTableQueries] = useState(initPaging)
  const [paging, setPaging] = useState({ total: 0, current: 1 })
  const [name, setName] = useState('')
  const [sort, setSort] = useState<ESort>()
  const [sortBy, setSortBy] = useState<string>()
  const [tag, setTag] = useState<EFailedTaskTag>()
  const [resolved, setResolved] = useState<boolean>()
  const [resolvedStatus, setResolvedStatus] = useState<boolean | null>()
  const [taskIds, setTaskIds] = useState<string[]>([])
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListFailedTask'] })
    toast.success('Cập nhật thành công')
    setTaskIds([])
    setResolvedStatus(null)
  }
  const { mutate: mutateUpdate, isPending: isPendingUpdate } =
    useMarkResolvedFailedTasks(onSuccess)

  const { mutate: mutateUndoUpdate, isPending: isPendingUndoUpdate } =
    useUndoMarkResolvedFailedTasks(onSuccess)

  useEffect(() => {
    setTableQueries(initPaging)
  }, [name])

  const { data, isLoading } = useGetListFailedTask({
    page_index: tableQueries.current,
    page_size: tableQueries.pageSize,
    name: name || undefined,
    sort,
    sort_by: sortBy,
    tag,
    resolved,
  })

  useEffect(() => {
    if (data) {
      setPaging({
        current: data.pagination.page_index,
        total: data.pagination.total,
      })
    }
  }, [data])

  const rowSelection: TableProps<IFailedTask>['rowSelection'] = {
    selectedRowKeys: taskIds,
    onChange: (selectedRowKeys: React.Key[], selectedRows: IFailedTask[]) => {
      setTaskIds(selectedRowKeys as string[])
      setResolvedStatus(
        selectedRows.length > 0 ? selectedRows[0].resolved : null
      )
    },
    getCheckboxProps: (record: IFailedTask) => ({
      disabled:
        resolvedStatus !== null &&
        resolvedStatus !== undefined &&
        record.resolved !== resolvedStatus,
    }),
    hideSelectAll: isEmpty(taskIds),
    renderCell: (_checked, _record, _index, originNode) => {
      return (
        <div
          onClick={(e) => {
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
          }}
        >
          {originNode}
        </div>
      )
    },
  }

  const columns: ColumnsType<IFailedTask> = [
    {
      title: 'Tên tác vụ',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: true,
      render: (text) => <span className='font-semibold'>{text}</span>,
    },
    {
      title: 'Loại',
      dataIndex: 'tag',
      key: 'tag',
      width: 150,
      sorter: true,
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'date_done',
      key: 'date_done',
      width: 150,
      sorter: true,
      render: (text) => (
        <span>{dayjs(text).tz(VN_TIMEZONE).format('DD/MM/YYYY HH:mm:ss')}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'resolved',
      key: 'resolved',
      width: 100,
      sorter: true,
      render: (resolved) => (
        <Tag color={resolved ? 'green' : 'volcano'}>
          {resolved ? 'Đã xử lý' : 'Chưa xử lý'}
        </Tag>
      ),
    },
  ]

  const onChangePagination = (pageIndex: number, pageSize: number) => {
    setTableQueries({ current: pageIndex, pageSize })
  }

  const onSearch = (val: string) => {
    setName(val)
  }
  const onChangeType = (val: EFailedTaskTag) => {
    setTag(val)
  }
  const onChangeEndpoint = (val: boolean) => {
    setResolved(val)
  }

  const handleTableChange: TableProps<IFailedTask>['onChange'] = (
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

  const handleMarkResolved = () => {
    if (resolvedStatus) {
      mutateUndoUpdate({ task_ids: taskIds })
    } else {
      mutateUpdate({ task_ids: taskIds })
    }
  }

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex flex-wrap gap-3'>
          <Input.Search
            className='w-60'
            placeholder='Tìm kiếm'
            size='large'
            onSearch={onSearch}
            allowClear
          />
          <Select
            className='w-60'
            size='large'
            placeholder='Lọc theo loại'
            onChange={onChangeType}
            value={tag}
            options={OPTIONS_FAILED_TASK_TAG}
            allowClear
            showSearch
          />
          <Select
            className='w-60'
            size='large'
            placeholder='Lọc theo trạng thái'
            onChange={onChangeEndpoint}
            value={resolved}
            options={OPTIONS_FAILED_TASK_STATUS}
            allowClear
            showSearch
          />
        </div>
        {resolvedStatus !== null && (
          <Button
            type='primary'
            className='px-4 py-2 font-semibold'
            style={{
              backgroundColor: resolvedStatus ? '#52c41a' : '#1890ff',
              borderColor: resolvedStatus ? '#52c41a' : '#1890ff',
            }}
            onClick={handleMarkResolved}
            disabled={isPendingUpdate || isPendingUndoUpdate}
            loading={isPendingUpdate || isPendingUndoUpdate}
          >
            {resolvedStatus ? 'Hoàn tác' : 'Đã xử lý'}
          </Button>
        )}
      </div>
      <Table
        rowSelection={rowSelection}
        showSorterTooltip={{ target: 'sorter-icon' }}
        onChange={handleTableChange}
        columns={columns}
        className='text-wrap'
        rowKey='task_id'
        pagination={false}
        dataSource={data?.data || []}
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
    </>
  )
}

export default FailedTasks
