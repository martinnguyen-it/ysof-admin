import { currentSeasonState } from '@atom/seasonAtom'
import { IOpenForm } from '@domain/common'
import { ISeasonResponse } from '@domain/season'
import { createSeason, updateSeason } from '@src/services/season'
import { Form, Input, Modal } from 'antd'
import { isEmpty } from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'

interface IProps {
  open: IOpenForm<ISeasonResponse>
  setOpen: React.Dispatch<React.SetStateAction<IOpenForm<ISeasonResponse>>>
  setReloadData: React.DispatchWithoutAction
}

const ModalAdd: FC<IProps> = ({ open, setOpen, setReloadData }) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const setCurrentSeason = useSetRecoilState(currentSeasonState)

  const handleOk = async () => {
    setConfirmLoading(true)
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      let res: ISeasonResponse
      if (open?.item) {
        res = await updateSeason(open.item.id, data)
        if (!isEmpty(res)) {
          toast.success('Sửa thành công')
          setOpen({ active: false })
          setReloadData()
        }
      } else {
        res = await createSeason(data)
        if (!isEmpty(res)) {
          setCurrentSeason(res)
          toast.success('Thêm thành công')
          setOpen({ active: false })
          setReloadData()
        }
      }
    } catch (error) {
      setConfirmLoading(false)
    }

    setConfirmLoading(false)
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
      confirmLoading={confirmLoading}
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
