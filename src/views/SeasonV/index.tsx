import { FC, useState } from 'react'
import { useGetListSeasons } from '@/apis/season/useQuerySeason'
import { userInfoState } from '@/atom/authAtom'
import { EAdminRole } from '@/domain/admin/type'
import { IOpenForm } from '@/domain/common'
import { ISeasonResponse } from '@/domain/season'
import {
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, MenuProps } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { includes, isArray } from 'lodash'
import { useRecoilValue } from 'recoil'
import ModalAdd from './ModalAdd'
import ModalDelete from './ModalDelete'

const SeasonV: FC = () => {
  const [openForm, setOpenForm] = useState<IOpenForm<ISeasonResponse>>({
    active: false,
  })
  const [openDel, setOpenDel] = useState<IOpenForm<string>>({ active: false })
  const userInfo = useRecoilValue(userInfoState)

  const { data, isLoading } = useGetListSeasons()

  const onClickAdd = () => {
    setOpenForm({ active: true })
  }

  const onClickUpdate = (id: string) => {
    const item = isArray(data) ? data.find((val) => val.id === id) : undefined
    setOpenForm({ active: true, item })
  }

  const onClickDelete = (id: string) => {
    setOpenDel({ active: true, item: id })
  }

  const isAdmin = userInfo && includes(userInfo.roles, EAdminRole.ADMIN)

  const columns: ColumnsType<ISeasonResponse> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Tên',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, data: ISeasonResponse) => {
        return (
          <span className={`${data.is_current ? 'text-red-500' : ''}`}>
            {text}
          </span>
        )
      },
      width: '50%',
    },
    {
      title: 'Mùa',
      dataIndex: 'season',
      key: 'season',
    },
    {
      title: 'Năm học',
      key: 'academic_year',
      dataIndex: 'academic_year',
    },
    {
      title: '',
      key: 'actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: '40px',
      className: '!p-0',
      align: 'center',
      render: (_, data: ISeasonResponse) => {
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
        )
      },
      hidden: !isAdmin,
    },
  ]

  return (
    <>
      {isAdmin && (
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
        columns={columns}
        rowKey='id'
        pagination={false}
        dataSource={data || []}
        loading={isLoading}
        bordered
      />
      {openForm.active && <ModalAdd open={openForm} setOpen={setOpenForm} />}
      {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} />}
    </>
  )
}

export default SeasonV
