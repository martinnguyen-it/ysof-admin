import { FileAddOutlined } from '@ant-design/icons'
import { IOpenForm } from '@domain/common'
import { ISeasonResponse } from '@domain/season'
import { getListSeasons } from '@src/services/season'
import { Button, Flex } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { FC, MouseEvent, useEffect, useReducer, useState } from 'react'
import ModalAdd from './ModalAdd'
import ModalDelete from './ModalDelete'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@atom/authAtom'
import { EAdminRole } from '@domain/admin/type'
import { includes } from 'lodash'

const SeasonV: FC = () => {
  const [tableData, setTableData] = useState<{ data: ISeasonResponse[]; loading: boolean }>({
    data: [],
    loading: false,
  })
  const [reloadData, setReloadData] = useReducer((prev) => !prev, false)
  const [openForm, setOpenForm] = useState<IOpenForm<ISeasonResponse>>({ active: false })
  const [openDel, setOpenDel] = useState<IOpenForm<string>>({ active: false })
  const userInfo = useRecoilValue(userInfoState)
  const onClickAdd = () => {
    setOpenForm({ active: true })
  }

  const onClickUpdate = (e: MouseEvent<HTMLButtonElement>) => {
    const item = tableData.data.find((val) => val.id === e.currentTarget.id)
    setOpenForm({ active: true, item: item })
  }

  const onClickDelete = (e: MouseEvent<HTMLButtonElement>) => {
    setOpenDel({ active: true, item: e.currentTarget.id })
  }

  const isAdmin = userInfo && includes(userInfo.roles, EAdminRole.ADMIN)

  useEffect(() => {
    ;(async () => {
      setTableData((tableData) => ({ ...tableData, loading: true }))
      const data = await getListSeasons()
      setTableData({ data: data || [], loading: false })
    })()
  }, [reloadData])

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
            <Button type='primary' id={data.id} onClick={onClickDelete} danger>
              Xóa
            </Button>
          </Flex>
        )
      },
      hidden: !isAdmin,
    },
  ]

  return (
    <div className='m-5 rounded-xl bg-white p-6 shadow-lg'>
      {isAdmin && (
        <div className='mb-4 flex justify-end'>
          <Button type='primary' icon={<FileAddOutlined />} onClick={onClickAdd} size={'middle'}>
            Thêm
          </Button>
        </div>
      )}
      <Table columns={columns} rowKey='id' pagination={false} dataSource={tableData.data} loading={tableData.loading} bordered />
      {openForm.active && <ModalAdd open={openForm} setOpen={setOpenForm} setReloadData={setReloadData} />}
      {openDel.active && <ModalDelete open={openDel} setOpen={setOpenDel} setReloadData={setReloadData} />}
    </div>
  )
}

export default SeasonV
