import { FC, Fragment, MouseEvent, useState } from 'react'
import { useGetListRollCallResult } from '@/apis/roll-call/useQueryRollCall'
import { useGetListSubjects } from '@/apis/subject/useQuerySubject'
import { userInfoState } from '@/atom/authAtom'
import { currentSeasonState } from '@/atom/seasonAtom'
import { EAdminRole } from '@/domain/admin/type'
import { ESort } from '@/domain/common'
import { IRollCallItemInResponse } from '@/domain/rollCall'
import { ESubjectStatus } from '@/domain/subject'
import { EAbsentType } from '@/domain/subject/subjectAbsent'
import { ImportOutlined } from '@ant-design/icons'
import { Button, Input, Select, Table, TableProps } from 'antd'
import Column from 'antd/es/table/Column'
import ColumnGroup from 'antd/es/table/ColumnGroup'
import { isArray, isEmpty } from 'lodash'
import { useRecoilValue } from 'recoil'
import { getRollCallResultBgColor, isSuperAdmin } from '@/lib/utils'
import { EResultRollCallDetail } from '@/constants/rollCall'
import ModalRollCall from './ModalRollCall'

const RollCallResultV: FC = () => {
  const initPaging = {
    current: 1,
    pageSize: 300,
  }
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<ESort>()
  const [sortBy, setSortBy] = useState<string>()
  const [group, setGroup] = useState<number>()
  const [openRollCall, setOpenRollCall] = useState(false)

  const {
    data: rollCall = { data: [], summary: {} },
    isLoading: isLoadingRollCall,
  } = useGetListRollCallResult({
    page_index: initPaging.current,
    page_size: initPaging.pageSize,
    search: search || undefined,
    sort,
    sort_by: sortBy,
    group,
  })

  const { data: subjects = [], isLoading: isLoadingSubjects } =
    useGetListSubjects({
      status: [ESubjectStatus.COMPLETED],
      sort: ESort.DESC,
      sort_by: 'start_at',
    })

  const isLoading = isLoadingRollCall || isLoadingSubjects

  const handleTableChange: TableProps<IRollCallItemInResponse>['onChange'] = (
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

  const onSearch = (val: string) => {
    setSearch(val)
  }
  const onChangeGroup = (val: string) => {
    setGroup(val ? Number(val) : undefined)
  }

  const userInfo = useRecoilValue(userInfoState)
  const currentSeason = useRecoilValue(currentSeasonState)

  const onClickRollCall = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setOpenRollCall(true)
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
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
        {userInfo &&
          ((userInfo.latest_season === currentSeason?.season &&
            userInfo.roles.includes(EAdminRole.BKL)) ||
            isSuperAdmin(true)) && (
            <div className='mb-4 flex justify-end gap-3'>
              <Button
                type='primary'
                icon={<ImportOutlined />}
                onClick={onClickRollCall}
                size={'middle'}
              >
                Điểm danh
              </Button>
            </div>
          )}
      </div>
      <Table<IRollCallItemInResponse>
        dataSource={rollCall.data}
        rowKey='id'
        loading={isLoading}
        bordered
        scroll={{ x: 2200 }}
        pagination={false}
        className='text-wrap'
        onChange={handleTableChange}
        summary={() => {
          let index = 0
          return !isEmpty(rollCall.summary) && !isEmpty(subjects) ? (
            <Table.Summary.Row className='font-bold'>
              <Table.Summary.Cell index={0} align='center' colSpan={2}>
                Thống kê
              </Table.Summary.Cell>
              {subjects.map((item) => (
                <Fragment key={item.id}>
                  <Table.Summary.Cell
                    index={++index}
                    align='center'
                    colSpan={1}
                    className='bg-yellow-100/30'
                  >
                    {rollCall.summary[item.id]['absent'] || 0}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={++index}
                    align='center'
                    colSpan={1}
                    className='bg-green-100/30'
                  >
                    {rollCall.summary[item.id]['no_complete'] || 0}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={++index}
                    align='center'
                    colSpan={1}
                  >
                    {rollCall.summary[item.id]['completed'] || 0}
                  </Table.Summary.Cell>
                </Fragment>
              ))}
            </Table.Summary.Row>
          ) : null
        }}
      >
        <Column<IRollCallItemInResponse>
          title='MSHV'
          dataIndex='numerical_order'
          key='numerical_order'
          align='center'
          sorter={true}
          render={(_, record: IRollCallItemInResponse) =>
            String(record.numerical_order).padStart(3, '0')
          }
        />
        <Column
          title='Tên Thánh - Họ và Tên'
          dataIndex='full_name'
          render={(_: string, record: IRollCallItemInResponse) =>
            `${record.holy_name} ${record.full_name}`
          }
          key='full_name'
          sorter={true}
        />

        {!isEmpty(subjects) &&
          subjects.map((subject) => (
            <ColumnGroup
              title={
                (subject.start_at
                  ? `${new Date(subject.start_at).toLocaleDateString('vi-VN')} - `
                  : '') +
                subject.code +
                '-' +
                subject.title
              }
              key={subject.id}
              dataIndex={['subjects', subject.id]}
            >
              <Column
                title='Zoom'
                dataIndex={['subjects', subject.id, 'attend_zoom']}
                key='attend_zoom'
                align='center'
                render={(_: string, record: IRollCallItemInResponse) =>
                  record.subjects[subject.id]?.attend_zoom ? 'x' : '-'
                }
                onCell={(record: IRollCallItemInResponse) => {
                  return {
                    className: getRollCallResultBgColor(
                      record.subjects[subject.id]?.result
                    ),
                  }
                }}
              />
              <Column
                title='Lượng Giá'
                dataIndex={['subjects', subject.id, 'evaluation']}
                align='center'
                render={(_: string, record: IRollCallItemInResponse) =>
                  record.subjects[subject.id]?.evaluation
                    ? 'x'
                    : record.subjects[subject.id]?.absent_type ===
                        EAbsentType.NO_EVALUATION
                      ? 'P'
                      : '-'
                }
                key='evaluation'
                onCell={(record: IRollCallItemInResponse) => {
                  return {
                    className: getRollCallResultBgColor(
                      record.subjects[subject.id]?.result
                    ),
                  }
                }}
              />
              <Column
                title='Kết Quả'
                dataIndex={['subjects', subject.id, 'result']}
                align='center'
                key='result'
                render={(_: string, record: IRollCallItemInResponse) =>
                  record.subjects[subject.id]?.result
                    ? EResultRollCallDetail[record.subjects[subject.id].result]
                    : '-'
                }
                onCell={(record: IRollCallItemInResponse) => {
                  return {
                    className: getRollCallResultBgColor(
                      record.subjects[subject.id]?.result
                    ),
                  }
                }}
              />
            </ColumnGroup>
          ))}
        <ColumnGroup title={'Tổng kết'} dataIndex={'summary'}>
          <Column
            title='HT'
            dataIndex='subject_completed'
            key='subject_completed'
            align='center'
          />
          <Column
            title='KHT'
            dataIndex='subject_not_completed'
            key='subject_not_completed'
            align='center'
          />
          <Column
            title='ĐK'
            dataIndex='subject_registered'
            key='subject_registered'
            align='center'
          />
        </ColumnGroup>
      </Table>
      <ModalRollCall open={openRollCall} setOpen={setOpenRollCall} />
    </div>
  )
}

export default RollCallResultV
