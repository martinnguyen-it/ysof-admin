import React, { FC, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useCreateSeason,
  useUpdateSeason,
} from '@/apis/season/useMutationSeason'
import { currentSeasonState } from '@/atom/seasonAtom'
import { IOpenForm } from '@/domain/common'
import { ISeasonResponse } from '@/domain/season'
import { Form, Input, Modal } from 'antd'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'

interface IProps {
  open: IOpenForm<ISeasonResponse>
  setOpen: React.Dispatch<React.SetStateAction<IOpenForm<ISeasonResponse>>>
}

const ModalAdd: FC<IProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm()
  const setCurrentSeason = useSetRecoilState(currentSeasonState)
  const queryClient = useQueryClient()

  const isUpdateForm = !isEmpty(open?.item)

  const onSuccess = (data: ISeasonResponse) => {
    queryClient.invalidateQueries({ queryKey: ['getListSeasons'] })
    if (isUpdateForm) toast.success('Sửa thành công')
    else {
      toast.success('Thêm thành công')
      setCurrentSeason(data)
    }
    setOpen({ active: false })
  }

  const { mutate: mutateCreate, isPending: isPendingCreate } =
    useCreateSeason(onSuccess)
  const { mutate: mutateUpdate, isPending: isPendingUpdate } =
    useUpdateSeason(onSuccess)

  const handleOk = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      if (open?.item) {
        mutateUpdate({
          id: open.item.id,
          data,
        })
      } else {
        mutateCreate(data)
      }
    } catch {}
  }

  const handleCancel = () => {
    setOpen({ active: false })
  }

  useEffect(() => {
    if (open?.item) form.setFieldsValue(open.item)
  }, [open])

  return (
    <Modal
      title={open.item ? 'Sửa' : 'Thêm'}
      open={open.active}
      onOk={handleOk}
      confirmLoading={isPendingCreate || isPendingUpdate}
      onCancel={handleCancel}
      cancelText='Hủy'
      okText={open.item ? 'Sửa' : 'Thêm'}
    >
      <Form layout='vertical' form={form} name='form-season'>
        <Form.Item
          name='title'
          label='Tên'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp tên chủ đề',
            },
          ]}
        >
          <Input placeholder='Tên chủ đề năm học' />
        </Form.Item>
        <Form.Item
          name='season'
          label='Mùa'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp mùa',
            },
          ]}
        >
          <Input placeholder='1' disabled={!!open?.item} />
        </Form.Item>
        <Form.Item
          name='academic_year'
          label='Năm học'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp năm học',
            },
          ]}
        >
          <Input placeholder='2020-2021' />
        </Form.Item>
        <Form.Item label='Mô tả' name='description'>
          <Input.TextArea rows={3} placeholder='Nhập mô tả' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAdd
