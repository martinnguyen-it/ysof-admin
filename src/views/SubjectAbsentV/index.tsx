import { ESort, IOpenForm } from '@domain/common'
import { Button, Flex, Select } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'

import { FC, MouseEvent, useEffect, useMemo, useReducer, useState } from 'react'
import { isArray, isObject, size } from 'lodash'
import { ESubjectStatus, ISubjectShortInResponse } from '@domain/subject'
import { getSubjectShort } from '@src/services/subject'
import { toast } from 'react-toastify'
import { getListSubjectAbsents } from '@src/services/subjectAbsent'
import { ISubjectAbsentInResponse } from '@domain/subject/subjectAbsent'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@atom/authAtom'
import { EAdminRole } from '@domain/admin/type'
import { isSuperAdmin } from '@src/utils'
import ModalDelete from './ModalDelete'
import { currentSeasonState } from '@atom/seasonAtom'
import { FileAddOutlined } from '@ant-design/icons'
import ModalAdd from './ModalAdd'

const SubjectAbsentV: FC = () => {
  const [tableData, setTableData] = useState<ISubjectAbsentInResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [subjectSentStudent, setSubjectSentStudent] = useState<ISubjectShortInResponse[]>()
  const [selectSubject, setSelectSubject] = useState<string>()
  const [reloadData, setReloadData] = useReducer((prev) => !prev, false)
  const [openForm, setOpenForm] = useState<Required<IOpenForm<ISubjectAbsentInResponse | string>>>({ active: false, item: '' })
  const [openDel, setOpenDel] = useState<IOpenForm<{ studentId: string; subjectId: string }>>({ active: false })
  const userInfo = useRecoilValue(userInfoState)
  const currentSeason = useRecoilValue(currentSeasonState)

  const onClickAdd = () => {
    setOpenForm({ active: true, item: selectSubject || '' })
  }

  const onClickUpdate = (e: MouseEvent<HTMLButtonElement>) => {
    const item = tableData.find((val) => val.id === e.currentTarget.id)
    if (item) setOpenForm({ active: true, item: item })
  }

  const onClickDelete = (e: MouseEvent<HTMLButtonElement>) => {
    const item = tableData.find((val) => val.id === e.currentTarget.id)
    if (item) setOpenDel({ active: true, item: { studentId: item.student.id, subjectId: item.subject.id } })
  }

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const resSubject = await getSubjectShort({
        sort: ESort.DESC,
        sort_by: 'start_at',
        status: [ESubjectStatus.COMPLETED, ESubjectStatus.SENT_EVALUATION, ESubjectStatus.SENT_NOTIFICATION],
      })
      if (size(resSubject) > 0) {
        setSubjectSentStudent(resSubject)
        setSelectSubject(resSubject[0].id)
      } else {
        toast.warn('Chưa có môn học nào có nghỉ phép')
      }
      setIsLoading(false)
    })()
  }, [])

  useEffect(() => {
    if (selectSubject) {
      ;(async () => {
        setIsLoading(true)
        const data = await getListSubjectAbsents(selectSubject)
        if (isArray(data)) {
          setTableData(data)
        }
        setIsLoading(false)
      })()
    }
  }, [selectSubject, reloadData])

  const columns: ColumnsType<ISubjectAbsentInResponse> = [
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
    if (isArray(subjectSentStudent)) {
      return subjectSentStudent.map((item) => ({ value: item.id, label: item.code + ' ' + item.title }))
    }
  }, [subjectSentStudent])

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
        {userInfo && ((userInfo.latest_season === currentSeason.season && userInfo.roles.includes(EAdminRole.BHV)) || isSuperAdmin(true)) && (
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
        loading={isLoading}
        scroll={{ x: 1000 }}
        bordered
      />

      {openForm.active && <ModalAdd open={openForm} setOpen={setOpenForm} setReloadData={setReloadData} />}
      {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} setReloadData={setReloadData} />}
    </div>
  )
}

export default SubjectAbsentV
