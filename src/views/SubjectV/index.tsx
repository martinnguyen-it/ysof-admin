import { FC, MouseEvent, useState } from 'react'
import { useGetListSubjects } from '@/apis/subject/useQuerySubject'
import { userInfoState } from '@/atom/authAtom'
import { currentSeasonState } from '@/atom/seasonAtom'
import { EAdminRole } from '@/domain/admin/type'
import { ESort, IOpenForm, IOpenFormWithMode } from '@/domain/common'
import { ESubjectStatus, ISubjectInResponse } from '@/domain/subject'
import {
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import type { MenuProps, TableProps } from 'antd'
import { Button, Dropdown, Input, Select } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { isArray, isObject } from 'lodash'
import { useRecoilValue } from 'recoil'
import { hasMatch, isSuperAdmin } from '@/lib/utils'
import {
  ESubjectStatusDetail,
  OPTIONS_SUBDIVISION,
  OPTIONS_SUBJECT_STATUS,
} from '@/constants/subject'
import ModalAdd from './ModalAdd'
import ModalDelete from './ModalDelete'
import ModalView from './ModalView'

const SubjectV: FC = () => {
  const userInfo = useRecoilValue(userInfoState)
  const currentSeason = useRecoilValue(currentSeasonState)
  const [openForm, setOpenForm] = useState<
    IOpenFormWithMode<ISubjectInResponse>
  >({ active: false, mode: 'add' })
  const [openDel, setOpenDel] = useState<IOpenForm<string>>({ active: false })

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ESubjectStatus[]>()
  const [subdivision, setSubdivision] = useState<string>()
  const [sort, setSort] = useState<ESort>()
  const [sortBy, setSortBy] = useState<string>()

  const { data: tableData, isLoading } = useGetListSubjects({
    search,
    subdivision,
    status,
    sort,
    sort_by: sortBy,
  })

  const onClickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setOpenForm({ active: true, mode: 'add' })
  }

  const onClickUpdate = (id: string) => {
    const item = tableData && tableData.find((val) => val.id === id)
    setOpenForm({ active: true, mode: 'add', item })
  }

  const onClickDelete = (id: string) => {
    setOpenDel({ active: true, item: id })
  }

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
          {!record?.zoom ||
          (!record.zoom?.link &&
            !record.zoom?.meeting_id &&
            !record.zoom?.pass_code) ? (
            '--'
          ) : (
            <>
              {record.zoom?.link ? (
                <p>
                  <span className='font-medium'>Link:</span>{' '}
                  <a
                    className='text-blue-500'
                    href={record.zoom.link}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {record.zoom.link}
                  </a>
                </p>
              ) : (
                <></>
              )}
              {record.zoom?.meeting_id ? (
                <p className='break-all'>
                  <span className='font-medium'>ID:</span>{' '}
                  <span className='block'>{record.zoom.meeting_id}</span>
                </p>
              ) : (
                <></>
              )}
              {record.zoom?.pass_code ? (
                <p className='break-all'>
                  <span className='font-medium'>Mật khẩu:</span>{' '}
                  <span className='block'>{record.zoom.pass_code}</span>
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
      title: '',
      key: 'actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: '40px',
      className: '!p-0',
      align: 'center',
      render: (_, data: ISubjectInResponse) => {
        const items: MenuProps['items'] = [
          {
            key: 'edit',
            label: <span style={{ color: '#3498db' }}>Sửa</span>,
            icon: <EditOutlined style={{ color: '#3498db' }} />,
          },
          {
            key: 'delete',
            label: 'Xóa',
            danger: true,
            icon: <DeleteOutlined />,
          },
        ]

        const handleMenuClick: MenuProps['onClick'] = (e) => {
          e.domEvent.stopPropagation()
          switch (e.key) {
            case 'edit':
              onClickUpdate(data.id)
              break
            case 'delete':
              onClickDelete(data.id)
              break
            default:
              break
          }
        }

        return (
          userInfo &&
          (((userInfo.roles.includes(EAdminRole.BHV) || isSuperAdmin(true)) && (
            <>
              <Dropdown
                menu={{ items, onClick: handleMenuClick }}
                placement='bottomRight'
                trigger={['click']}
              >
                <Button
                  type='text'
                  icon={<MoreOutlined rotate={90} />}
                  onClick={(e) => e.stopPropagation()}
                />
              </Dropdown>
            </>
          )) ||
            (userInfo.roles.includes(EAdminRole.BKT) && (
              <Dropdown
                menu={{
                  items: [items[0]],
                  onClick: handleMenuClick,
                }}
                placement='bottomRight'
                trigger={['click']}
              >
                <Button
                  type='text'
                  icon={<MoreOutlined rotate={90} />}
                  onClick={(e) => e.stopPropagation()}
                />
              </Dropdown>
            )))
        )
      },
      hidden:
        !userInfo ||
        !(
          hasMatch(userInfo.roles, [EAdminRole.BHV, EAdminRole.BKT]) ||
          isSuperAdmin(true)
        ),
    },
  ]

  const onSearch = (val: string) => {
    setSearch(val)
  }
  const onChangSubdivision = (val: string) => {
    setSubdivision(val)
  }
  const onChangeStatus = (val: ESubjectStatus[]) => {
    setStatus(val)
  }

  const handleTableChange: TableProps<ISubjectInResponse>['onChange'] = (
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
          className='w-60'
          size='large'
          placeholder='Lọc theo phân môn'
          filterOption={(input, option) =>
            isObject(option) &&
            (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
          }
          onChange={onChangSubdivision}
          value={subdivision}
          options={OPTIONS_SUBDIVISION}
          allowClear
          showSearch
          maxTagCount='responsive'
        />
        <Select
          className='w-72'
          size='large'
          placeholder='Lọc theo trạng thái'
          onChange={onChangeStatus}
          value={status}
          mode='tags'
          options={OPTIONS_SUBJECT_STATUS}
          allowClear
          maxTagCount='responsive'
        />
      </div>

      {userInfo &&
        ((userInfo.latest_season === currentSeason?.season &&
          userInfo.roles.includes(EAdminRole.BHV)) ||
          isSuperAdmin(true)) && (
          <div className='mb-4 flex justify-end'>
            <Button
              type='primary'
              icon={<FileAddOutlined />}
              onClick={onClickAdd}
              size={'middle'}
            >
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
        dataSource={tableData || []}
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
      {openForm.active && openForm.mode !== 'view' && (
        <ModalAdd open={openForm} setOpen={setOpenForm} />
      )}
      {openForm.active && openForm.mode === 'view' && (
        <ModalView open={openForm} setOpen={setOpenForm} />
      )}
      {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} />}
    </>
  )
}

export default SubjectV
