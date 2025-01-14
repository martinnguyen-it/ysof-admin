import { ESort, IOpenForm } from '@domain/common'
import { Button, Flex, Select } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'

import { FC, MouseEvent, useEffect, useMemo, useState } from 'react'
import { isArray, isObject, size } from 'lodash'
import { ESubjectStatus } from '@domain/subject'
import { toast } from 'react-toastify'
import { ISubjectAbsentInResponse } from '@domain/subject/subjectAbsent'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@atom/authAtom'
import { EAdminRole } from '@domain/admin/type'
import { isSuperAdmin } from '@src/utils'
import ModalDelete from './ModalDelete'
import { currentSeasonState } from '@atom/seasonAtom'
import { FileAddOutlined } from '@ant-design/icons'
import ModalAdd from './ModalAdd'
import { useGetSubjectShort } from '@src/apis/subject/useQuerySubject'
import { useGetListSubjectAbsents } from '@src/apis/subjectAbsent/useQuerySubjectAbsent'

const SubjectAbsentV: FC = () => {
  const [selectSubject, setSelectSubject] = useState<string>()
  const [openForm, setOpenForm] = useState<Required<IOpenForm<ISubjectAbsentInResponse | string>>>({ active: false, item: '' })
  const [openDel, setOpenDel] = useState<IOpenForm<{ studentId: string; subjectId: string }>>({ active: false })
  const userInfo = useRecoilValue(userInfoState)
  const currentSeason = useRecoilValue(currentSeasonState)

  const { data: subjectsSentStudent, isLoading: isLoadingSubject } = useGetSubjectShort({
    sort: ESort.DESC,
    sort_by: 'start_at',
    status: [ESubjectStatus.COMPLETED, ESubjectStatus.SENT_EVALUATION, ESubjectStatus.SENT_NOTIFICATION],
  })

  useEffect(() => {
    if (isArray(subjectsSentStudent))
      if (size(subjectsSentStudent) > 0) {
        setSelectSubject(subjectsSentStudent[0].id)
      } else {
        toast.warn('Chưa có môn học nào có nghỉ phép')
      }
  }, [subjectsSentStudent])

  const { data: tableData, isLoading: isLoadingAbsent } = useGetListSubjectAbsents(selectSubject || '', !!selectSubject)

  const onClickAdd = () => {
    setOpenForm({ active: true, item: selectSubject || '' })
  }

  const onClickUpdate = (e: MouseEvent<HTMLButtonElement>) => {
    const item = tableData && tableData.find((val) => val.id === e.currentTarget.id)
    if (item) setOpenForm({ active: true, item: item })
  }

  const onClickDelete = (e: MouseEvent<HTMLButtonElement>) => {
    const item = tableData && tableData.find((val) => val.id === e.currentTarget.id)
    if (item) setOpenDel({ active: true, item: { studentId: item.student.id, subjectId: item.subject.id } })
  }

  const columns: ColumnsType<ISubjectAbsentInResponse> = [
    {
      title: 'MSHV',
      dataIndex: ['student', 'numerical_order'],
      align: 'center',
      key: 'numerical_order',
      width: '80px',
      render: (_, record: ISubjectAbsentInResponse) => String(record.student.seasons_info[record.student.seasons_info.length - 1].numerical_order).padStart(3, '0'),
    },
    {
      title: 'Nhóm',
      dataIndex: ['student', 'group'],
      key: 'group',
      align: 'center',
      width: '80px',
      render: (_, record: ISubjectAbsentInResponse) => record.student.seasons_info[record.student.seasons_info.length - 1].group,
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
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Hành động',
      key: 'actions',
      dataIndex: 'actions',
      fixed: 'right',
      render: (_, data) => {
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
      hidden: !userInfo || !(userInfo.roles.includes(EAdminRole.BKL) || isSuperAdmin(true)),
    },
  ]
  const onChangeSelectSubject = (val: string) => {
    setSelectSubject(val)
  }
  const subjectOptions = useMemo(() => {
    if (isArray(subjectsSentStudent)) {
      return subjectsSentStudent.map((item) => ({ value: item.id, label: item.code + ' ' + item.title }))
    }
  }, [subjectsSentStudent])

  return (
    <div className='min-h-[calc(100vh-48px)] bg-[#d8ecef42] p-6 shadow-lg'>
      <div className='mb-4 flex flex-wrap gap-3'>
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
      <div className='mb-4 flex justify-between'>
        <p className='my-3 font-semibold'>Tổng: {size(tableData) || 0}</p>{' '}
        {userInfo && ((userInfo?.latest_season === currentSeason?.season && userInfo.roles.includes(EAdminRole.BHV)) || isSuperAdmin(true)) && (
          <Button type='primary' icon={<FileAddOutlined />} onClick={onClickAdd} size={'middle'}>
            Thêm
          </Button>
        )}
      </div>
      <Table
        showSorterTooltip={{ target: 'sorter-icon' }}
        columns={columns}
        className='text-wrap'
        rowKey='id'
        pagination={false}
        dataSource={tableData}
        loading={isLoadingSubject || isLoadingAbsent}
        scroll={{ x: 1000 }}
        bordered
      />

      {openForm.active && <ModalAdd open={openForm} setOpen={setOpenForm} />}
      {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} />}
    </div>
  )
}

export default SubjectAbsentV
