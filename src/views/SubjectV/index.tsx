import { FileAddOutlined } from '@ant-design/icons'
import { ESort, IOpenForm, IOpenFormWithMode } from '@domain/common'
import { Button, Flex, Input, Select } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import type { TableProps } from 'antd'

import { FC, MouseEvent, useEffect, useReducer, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@atom/authAtom'
import { isArray, isEmpty } from 'lodash'
import dayjs from 'dayjs'
import ModalDelete from './ModalDelete'
import { currentSeasonState, selectSeasonState } from '@atom/seasonAtom'
import { hasMatch, isSuperAdmin } from '@src/utils'
import { EAdminRole } from '@domain/admin/type'
import { ESubjectStatus, ISubjectInResponse } from '@domain/subject'
import { getListSubjects } from '@src/services/subject'
import { ESubjectStatusDetail, OPTIONS_SUBDIVISION, OPTIONS_SUBJECT_STATUS } from '@constants/subject'
import ModalAdd from './ModalAdd'
import ModalView from './ModalView'

const SubjectV: FC = () => {
  const userInfo = useRecoilValue(userInfoState)
  const currentSeason = useRecoilValue(currentSeasonState)
  const [openForm, setOpenForm] = useState<IOpenFormWithMode<ISubjectInResponse>>({ active: false, mode: 'add' })
  const [openDel, setOpenDel] = useState<IOpenForm<string>>({ active: false })
  const [tableData, setTableData] = useState<ISubjectInResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [reloadData, setReloadData] = useReducer((prev) => !prev, false)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ESubjectStatus>()
  const [subdivision, setSubdivision] = useState<string>()
  const [sort, setSort] = useState<ESort>()
  const [sortBy, setSortBy] = useState<string>()

  const onClickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setOpenForm({ active: true, mode: 'add' })
  }

  const onClickUpdate = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const item = tableData.find((val) => val.id === e.currentTarget.id)
    setOpenForm({ active: true, mode: 'add', item })
  }

  const onClickDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setOpenDel({ active: true, item: e.currentTarget.id })
  }

  const season = useRecoilValue(selectSeasonState)
  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const data = await getListSubjects({ search, subdivision, status, sort, sort_by: sortBy, season })
      if (!isEmpty(data) || isArray(data)) {
        setTableData(data)
      }
      setIsLoading(false)
    })()
  }, [reloadData, subdivision, search, status, sort, sortBy, season])

  const columns: ColumnsType<ISubjectInResponse> = [
    {
      title: 'STT',
      align: 'center',
      dataIndex: 'index',
      key: 'index',
      width: '60px',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Mã chủ đề',
      dataIndex: 'code',
      align: 'center',
      sorter: true,
      width: '120px',
      key: 'code',
    },
    {
      title: 'Tên chủ đề',
      dataIndex: 'title',
      sorter: true,
      key: 'title',
    },
    {
      title: 'Phân môn',
      dataIndex: 'subdivision',
      sorter: true,
      key: 'subdivision',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'lecturer',
      key: 'lecturer',
      render: (_, record) => (
        <p className='text-wrap font-medium text-blue-500'>
          {record.lecturer?.title ? record.lecturer.title + ' ' : ''}
          {record.lecturer?.holy_name ? record.lecturer.holy_name + ' ' : ''}
          {record.lecturer.full_name}
        </p>
      ),
    },
    {
      title: 'Ngày học',
      dataIndex: 'start_at',
      key: 'start_at',
      sorter: true,
      render: (_, record) => <>{dayjs(record.start_at).format('DD-MM-YYYY')}</>,
    },
    {
      title: 'Thông tin zoom',
      dataIndex: 'zoom',
      key: 'zoom',
      render: (_, record) => (
        <p className='text-wrap'>
          {!record?.zoom || (!record.zoom?.link && !record.zoom?.meeting_id && !record.zoom?.pass_code) ? (
            '--'
          ) : (
            <>
              {record.zoom?.link ? (
                <p>
                  <span className='font-medium'>Link:</span>{' '}
                  <a className='text-blue-500' href={record.zoom.link} target='_blank' rel='noreferrer'>
                    {record.zoom.link}
                  </a>
                </p>
              ) : (
                <></>
              )}
              {record.zoom?.meeting_id ? (
                <p className='break-all'>
                  <span className='font-medium'>ID:</span> <span className='block'>{record.zoom.meeting_id}</span>
                </p>
              ) : (
                <></>
              )}
              {record.zoom?.pass_code ? (
                <p className='break-all'>
                  <span className='font-medium'>Mật khẩu:</span> <span className='block'>{record.zoom.pass_code}</span>
                </p>
              ) : (
                <></>
              )}
            </>
          )}
        </p>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (text: ESubjectStatus) => ESubjectStatusDetail[text],
    },
    {
      title: 'Hành động',
      key: 'actions',
      dataIndex: 'actions',
      fixed: 'right',
      render: (_, data: ISubjectInResponse) => {
        return (
          <Flex gap='small' wrap='wrap'>
            {userInfo &&
              (((userInfo.roles.includes(EAdminRole.BHV) || isSuperAdmin(true)) && (
                <>
                  <Button color='' type='primary' id={data.id} onClick={onClickUpdate} className='!bg-yellow-400 hover:opacity-80'>
                    Sửa
                  </Button>
                  <Button type='primary' id={data.id} onClick={onClickDelete} danger>
                    Xóa
                  </Button>
                </>
              )) ||
                (userInfo.roles.includes(EAdminRole.BKT) && (
                  <Button color='' type='primary' id={data.id} onClick={onClickUpdate} className='!bg-yellow-400 hover:opacity-80'>
                    Sửa
                  </Button>
                )))}
          </Flex>
        )
      },
      hidden: !userInfo || !(hasMatch(userInfo.roles, [EAdminRole.BHV, EAdminRole.BKT]) || isSuperAdmin(true)),
    },
  ]

  const onSearch = (val: string) => {
    setSearch(val)
  }
  const onChangSubdivision = (val: string) => {
    setSubdivision(val)
  }
  const onChangeStatus = (val: ESubjectStatus) => {
    setStatus(val)
  }

  const handleTableChange: TableProps<ISubjectInResponse>['onChange'] = (_pagination, _filters, sorter) => {
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
          placeholder='Lọc theo phân môn'
          onChange={onChangSubdivision}
          value={subdivision}
          options={OPTIONS_SUBDIVISION}
          allowClear
          maxTagCount='responsive'
        />
        <Select
          className='w-60'
          size='large'
          placeholder='Lọc theo trạng thái'
          onChange={onChangeStatus}
          value={status}
          options={OPTIONS_SUBJECT_STATUS}
          allowClear
          maxTagCount='responsive'
        />
      </div>

      {userInfo && ((userInfo.current_season === currentSeason?.season && userInfo.roles.includes(EAdminRole.BHV)) || isSuperAdmin(true)) && (
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
      {openForm.active && openForm.mode !== 'view' && <ModalAdd open={openForm} setOpen={setOpenForm} setReloadData={setReloadData} />}
      {openForm.active && openForm.mode === 'view' && <ModalView open={openForm} setOpen={setOpenForm} />}
      {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} setReloadData={setReloadData} />}
    </div>
  )
}

export default SubjectV
