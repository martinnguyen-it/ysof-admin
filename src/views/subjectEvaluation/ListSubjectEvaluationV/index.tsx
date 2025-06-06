import { FC, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useGetSubjectShort } from '@/apis/subject/useQuerySubject'
import { useGetListSubjectEvaluation } from '@/apis/subjectEvaluation/useQuerySubjectEvaluation'
import { useGetSubjectEvaluationQuestions } from '@/apis/subjectEvaluationQuestion/useQuerySubjectEvaluationQuestion'
import { ESort } from '@/domain/common'
import { ESubjectStatus } from '@/domain/subject'
import { ISubjectEvaluationInResponse } from '@/domain/subject/subjectEvaluation'
import { IEvaluationQuestionItem } from '@/domain/subject/subjectEvaluationQuestion'
import type { TableProps } from 'antd'
import { Input, Pagination, Select } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { isArray, isObject, size } from 'lodash'
import { toast } from 'react-toastify'
import { PAGE_SIZE_OPTIONS_DEFAULT } from '@/constants/index'
import {
  EVALUATION_NAME,
  EVALUATION_QUALITY,
} from '@/constants/subjectEvaluation'
import ModalView from './ModalView'

const ListSubjectEvaluationV: FC = () => {
  const navigate = useNavigate()
  const { evaluationId, subjectId } = useSearch({
    from: '/_authenticated/luong-gia/ket-qua',
  })
  const initPaging = {
    current: 1,
    pageSize: 300,
  }
  const [tableQueries, setTableQueries] = useState(initPaging)
  const [paging, setPaging] = useState({ total: 0, current: 1 })
  const [searchText, setSearchText] = useState('')
  const [sort, setSort] = useState<ESort>()
  const [sortBy, setSortBy] = useState<string>()
  const [group, setGroup] = useState<number>()
  const [selectSubject, setSelectSubject] = useState<string | undefined>(
    subjectId
  )
  const [selectedEvaluation, setSelectedEvaluation] =
    useState<ISubjectEvaluationInResponse>()
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  useEffect(() => {
    setTableQueries(initPaging)
  }, [searchText])

  const {
    data: subjectsSentEvaluation,
    isLoading: isLoadingSubjects,
    isSuccess,
  } = useGetSubjectShort({
    sort: ESort.DESC,
    sort_by: 'start_at',
    status: [ESubjectStatus.COMPLETED, ESubjectStatus.SENT_EVALUATION],
  })

  const { data: listSubjectEvaluation, isLoading: isLoadingSubjectEvaluation } =
    useGetListSubjectEvaluation(
      {
        subject_id: selectSubject!,
        page_index: tableQueries.current,
        page_size: tableQueries.pageSize,
        search: searchText || undefined,
        sort,
        sort_by: sortBy,
        group,
      },
      { enabled: !!selectSubject }
    )

  const {
    data: { questions } = { questions: [] as IEvaluationQuestionItem[] },
    isLoading: isLoadingQuestions,
  } = useGetSubjectEvaluationQuestions({
    subjectId: selectSubject!,
    enabled: !!selectSubject,
  })

  useEffect(() => {
    if (!selectSubject && isSuccess && isArray(subjectsSentEvaluation)) {
      if (size(subjectsSentEvaluation) > 0) {
        setSelectSubject(subjectsSentEvaluation[0].id)

        // If evaluationId is in URL, find and show that evaluation
        if (evaluationId && listSubjectEvaluation?.data) {
          const evaluation = listSubjectEvaluation.data.find(
            (e) => e.id === evaluationId
          )
          if (evaluation) {
            setSelectedEvaluation(evaluation)
            setIsViewModalOpen(true)
          }
        }
      } else {
        toast.warn('Chưa có môn học nào có lượng giá')
      }
    }
  }, [
    isSuccess,
    subjectsSentEvaluation,
    evaluationId,
    subjectId,
    listSubjectEvaluation,
  ])

  useEffect(() => {
    if (listSubjectEvaluation) {
      setPaging({
        current: listSubjectEvaluation.pagination.page_index,
        total: listSubjectEvaluation.pagination.total,
      })
    }
  }, [listSubjectEvaluation])

  const handleViewEvaluation = (record: ISubjectEvaluationInResponse) => {
    setSelectedEvaluation(record)
    setIsViewModalOpen(true)
    // Update URL with subject and evaluation IDs
    navigate({
      to: '/luong-gia/ket-qua',
      search: {
        subjectId: selectSubject!,
        evaluationId: record.id,
      },
    })
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedEvaluation(undefined)
    // Remove evaluationId from URL but keep subjectId
    navigate({
      to: '/luong-gia/ket-qua',
    })
  }

  const columns: ColumnsType<ISubjectEvaluationInResponse> = useMemo(() => {
    const columns: ColumnsType<ISubjectEvaluationInResponse> = [
      {
        title: 'MSHV',
        dataIndex: ['student', 'numerical_order'],
        align: 'center',
        key: 'numerical_order',
        width: '80px',
        render: (_, record: ISubjectEvaluationInResponse) =>
          String(
            record.student.seasons_info[record.student.seasons_info.length - 1]
              .numerical_order
          ).padStart(3, '0'),
      },
      {
        title: 'Nhóm',
        dataIndex: ['student', 'group'],
        key: 'group',
        align: 'center',
        width: '80px',
        render: (_, record: ISubjectEvaluationInResponse) =>
          record.student.seasons_info[record.student.seasons_info.length - 1]
            .group,
      },
      {
        title: 'Họ tên',
        dataIndex: ['student', 'full_name'],
        key: 'full_name',
        width: '200px',
        render: (_, record) => (
          <div
            className='cursor-pointer text-blue-600 hover:underline'
            onClick={() => handleViewEvaluation(record)}
          >
            {record.student.holy_name} {record.student.full_name}
          </div>
        ),
      },
      {
        title: 'Email',
        dataIndex: ['student', 'email'],
        key: 'email',
        width: '200px',
      },
      {
        title: '1. ' + EVALUATION_NAME.get('feedback_admin'),
        dataIndex: 'feedback_admin',
        key: 'feedback_admin',
      },
      {
        title: '2. ' + EVALUATION_NAME.get('most_resonated'),
        dataIndex: 'most_resonated',
        key: 'most_resonated',
      },
      {
        title: '3. ' + EVALUATION_NAME.get('invited'),
        dataIndex: 'invited',
        key: 'invited',
      },
      {
        title: '4. ' + EVALUATION_NAME.get('feedback_lecturer'),
        dataIndex: 'feedback_lecturer',
        key: 'feedback_lecturer',
      },
      {
        title: '5. ' + EVALUATION_NAME.get('satisfied'),
        dataIndex: 'satisfied',
        sorter: true,
        key: 'satisfied',
      },
    ]
    EVALUATION_QUALITY.forEach((item, idx) => {
      columns.push({
        title:
          `6.${idx + 1}. ` +
          EVALUATION_NAME.get('quality') +
          ` [${item.label}]`,
        dataIndex: ['quality', item.key],
        sorter: true,
        key: item.key,
      })
    })

    let index = 7
    questions.forEach((item, idx) => {
      columns.push({
        title: `${index++}. ` + item.title,
        dataIndex: ['answers', idx],
        key: 'answers' + idx,
        render: (item) => (isArray(item) ? item.join(', ') : item),
      })
    })

    return columns
  }, [questions])

  const onChangePagination = (pageIndex: number, pageSize: number) => {
    setTableQueries({ current: pageIndex, pageSize })
  }

  const onSearch = (val: string) => {
    setSearchText(val)
  }
  const onChangeSelectSubject = (val: string) => {
    setSelectSubject(val)
  }
  const onChangeGroup = (val: string) => {
    setGroup(val ? Number(val) : undefined)
  }

  const handleTableChange: TableProps<ISubjectEvaluationInResponse>['onChange'] =
    (_pagination, _filters, sorter) => {
      if (!isArray(sorter) && sorter?.order) {
        const field =
          sorter.field &&
          (isArray(sorter.field) ? sorter.field.join('.') : sorter.field)
        setSort(sorter.order as ESort)
        setSortBy(field as string)
      } else {
        setSort(undefined)
        setSortBy(undefined)
      }
    }

  const subjectOptions = useMemo(() => {
    if (isArray(subjectsSentEvaluation)) {
      return subjectsSentEvaluation.map((item) => ({
        value: item.id,
        label: item.code + ' ' + item.title,
      }))
    }
  }, [subjectsSentEvaluation])

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
        <Select
          placeholder='Môn học'
          options={subjectOptions}
          size='large'
          className='w-60'
          value={selectSubject}
          onChange={onChangeSelectSubject}
          filterOption={(input, option) =>
            isObject(option) &&
            (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
          }
          showSearch
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
      </div>
      <Table
        showSorterTooltip={{ target: 'sorter-icon' }}
        onChange={handleTableChange}
        columns={columns}
        className='text-wrap'
        rowKey='id'
        pagination={false}
        dataSource={listSubjectEvaluation?.data}
        loading={
          isLoadingQuestions || isLoadingSubjects || isLoadingSubjectEvaluation
        }
        scroll={{ x: 3500 }}
        bordered
      />

      <ModalView
        open={isViewModalOpen}
        onClose={handleCloseViewModal}
        data={selectedEvaluation}
        questions={questions}
      />
    </>
  )
}

export default ListSubjectEvaluationV
