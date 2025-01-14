import { FileAddOutlined } from '@ant-design/icons'
import { IOpenForm } from '@domain/common'
import { ISeasonResponse } from '@domain/season'
import { Button, Flex } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { FC, MouseEvent, useState } from 'react'
import ModalAdd from './ModalAdd'
import ModalDelete from './ModalDelete'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@atom/authAtom'
import { EAdminRole } from '@domain/admin/type'
import { includes, isArray } from 'lodash'
import { useGetListSeasons } from '@src/apis/season/useQuerySeason'

const SeasonV: FC = () => {
  const [openForm, setOpenForm] = useState<IOpenForm<ISeasonResponse>>({ active: false })
  const [openDel, setOpenDel] = useState<IOpenForm<string>>({ active: false })
  const userInfo = useRecoilValue(userInfoState)

  const { data, isLoading } = useGetListSeasons()

  const onClickAdd = () => {
    setOpenForm({ active: true })
  }

  const onClickUpdate = (e: MouseEvent<HTMLButtonElement>) => {
    const item = isArray(data) ? data.find((val) => val.id === e.currentTarget.id) : undefined
    setOpenForm({ active: true, item })
  }

  const onClickDelete = (e: MouseEvent<HTMLButtonElement>) => {
    setOpenDel({ active: true, item: e.currentTarget.id })
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
        return <span className={`${data.is_current ? 'text-red-500' : ''}`}>{text}</span>
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
      title: 'Hành động',
      key: 'actions',
      dataIndex: 'actions',
      render: (_, data: ISeasonResponse) => {
        return (
          <Flex gap='small' wrap='wrap'>
            <Button color='' type='primary' id={data.id} onClick={onClickUpdate} className='!bg-yellow-400 hover:opacity-80'>
              Sửa
            </Button>
            {!data.is_current && (
              <Button type='primary' id={data.id} onClick={onClickDelete} danger>
                Xóa
              </Button>
            )}
          </Flex>
        )
      },
      hidden: !isAdmin,
    },
  ]

  return (
    <div className='min-h-[calc(100vh-48px)] bg-[#d8ecef42] p-6 shadow-lg'>
      {isAdmin && (
        <div className='mb-4 flex justify-end'>
          <Button type='primary' icon={<FileAddOutlined />} onClick={onClickAdd} size={'middle'}>
            Thêm
          </Button>
        </div>
      )}
      <Table columns={columns} rowKey='id' pagination={false} dataSource={data || []} loading={isLoading} bordered />
      {openForm.active && <ModalAdd open={openForm} setOpen={setOpenForm} />}
      {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} />}
    </div>
  )
}

export default SeasonV
