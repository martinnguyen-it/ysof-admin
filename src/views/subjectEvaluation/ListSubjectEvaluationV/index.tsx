import { ESort } from '@domain/common'
import { Input, Pagination, Select } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import type { TableProps } from 'antd'

import { FC, useEffect, useMemo, useState } from 'react'
import { isArray, isEmpty, isObject, size } from 'lodash'
import { PAGE_SIZE_OPTIONS_DEFAULT } from '@constants/index'
import { ESubjectStatus, ISubjectShortInResponse } from '@domain/subject'
import { getSubjectShort } from '@src/services/subject'
import { getListSubjectEvaluation } from '@src/services/subjectEvaluation'
import { ISubjectEvaluationInResponse } from '@domain/subject/subjectEvaluation'
import { toast } from 'react-toastify'
import { EVALUATION_NAME, EVALUATION_QUALITY } from '@constants/subjectEvaluation'
import { IEvaluationQuestionItem } from '@domain/subject/subjectEvaluationQuestion'
import { getSubjectEvaluationQuestions } from '@src/services/subjectEvaluationQuestion'
// import ModalView from './ModalView'

const ListSubjectEvaluationV: FC = () => {
  const [tableData, setTableData] = useState<ISubjectEvaluationInResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [subjectSentEvaluation, setSubjectSentEvaluation] = useState<ISubjectShortInResponse[]>()

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
  const [selectSubject, setSelectSubject] = useState<string>()
  const [questions, setQuestions] = useState<IEvaluationQuestionItem[]>()

  useEffect(() => {
    setTableQueries(initPaging)
  }, [search])

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const resSubject = await getSubjectShort({ sort: ESort.DESC, sort_by: 'start_at', status: [ESubjectStatus.COMPLETED, ESubjectStatus.SENT_EVALUATION] })
      if (size(resSubject) > 0) {
        setSubjectSentEvaluation(resSubject)
        setSelectSubject(resSubject[0].id)
      } else {
        toast.warn('Chưa có môn học nào có lượng giá')
      }
      setIsLoading(false)
    })()
  }, [])

  useEffect(() => {
    if (selectSubject) {
      ;(async () => {
        setIsLoading(true)
        const res = await getListSubjectEvaluation({
          subject_id: selectSubject,
          page_index: tableQueries.current,
          page_size: tableQueries.pageSize,
          search: search || undefined,
          sort,
          sort_by: sortBy,
          group,
        })
        if (!isEmpty(res)) {
          setTableData(res.data)
          setPaging({ current: res.pagination.page_index, total: res.pagination.total })
        }
        const resQuestion = await getSubjectEvaluationQuestions(selectSubject)
        if (resQuestion) {
          setQuestions(resQuestion.questions)
        }
        setIsLoading(false)
      })()
    }
  }, [selectSubject, search, sort, sortBy, group])

  const columns: ColumnsType<ISubjectEvaluationInResponse> = useMemo(() => {
    const columns: ColumnsType<ISubjectEvaluationInResponse> = [
      {
        title: 'MSHV',
        dataIndex: ['student', 'numerical_order'],
        align: 'center',
        key: 'numerical_order',
        width: '80px',
        render: (text) => String(text).padStart(3, '0'),
      },
      {
        title: 'Nhóm',
        dataIndex: ['student', 'group'],
        key: 'group',
        align: 'center',
        width: '80px',
      },
      {
        title: 'Họ tên',
        dataIndex: ['student', 'full_name'],
        key: 'full_name',
        width: '200px',
        render: (_, record) => (
          <>
            {record.student.holy_name} {record.student.full_name}
          </>
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
        title: `6.${idx + 1}. ` + EVALUATION_NAME.get('quality') + ` [${item.label}]`,
        dataIndex: ['quality', item.key],
        sorter: true,
        key: item.key,
      })
    })

    let index = 7
    if (isArray(questions)) {
      questions.forEach((item, idx) => {
        columns.push({
          title: `${index++}. ` + item.title,
          dataIndex: ['answers', idx],
          key: 'answers' + idx,
          render: (item) => (isArray(item) ? item.join(', ') : item),
        })
      })
    }

    return columns
  }, [questions])

  const onChangePagination = (pageIndex: number, pageSize: number) => {
    setTableQueries({ current: pageIndex, pageSize })
  }

  const onSearch = (val: string) => {
    setSearch(val)
  }
  const onChangeSelectSubject = (val: string) => {
    setSelectSubject(val)
  }
  const onChangeGroup = (val: string) => {
    setGroup(val ? Number(val) : undefined)
  }

  const handleTableChange: TableProps<ISubjectEvaluationInResponse>['onChange'] = (_pagination, _filters, sorter) => {
    if (!isArray(sorter) && sorter?.order) {
      const field = sorter.field && (isArray(sorter.field) ? sorter.field.join('.') : sorter.field)
      setSort(sorter.order as ESort)
      setSortBy(field as string)
    } else {
      setSort(undefined)
      setSortBy(undefined)
    }
  }

  const subjectOptions = useMemo(() => {
    if (isArray(subjectSentEvaluation)) {
      return subjectSentEvaluation.map((item) => ({ value: item.id, label: item.code + ' ' + item.title }))
    }
  }, [subjectSentEvaluation])

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
        <Select
          placeholder='Môn học'
          options={subjectOptions}
          size='large'
          className='w-60'
          value={selectSubject}
          onChange={onChangeSelectSubject}
          filterOption={(input, option) =>
            isObject(option) && (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
          }
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
        scroll={{ x: 3500 }}
        bordered
      />

      {/* {openForm.active && openForm.mode !== 'view' && <ModalAdd open={openForm} setOpen={setOpenForm} setReloadData={setReloadData} />} */}
    </div>
  )
}

export default ListSubjectEvaluationV
