import { Card, Form, Modal } from 'antd'
import { isEmpty, size } from 'lodash'
import React, { Dispatch, DispatchWithoutAction, FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IImportStudentFromSpreadSheetsResponse } from '@domain/student'
import { importStudent } from '@src/services/student'
import FormImport from './FormImport'

interface IProps {
  open: boolean
  setOpen: Dispatch<React.SetStateAction<boolean>>
  setReloadData: DispatchWithoutAction
}

const ModalImport: FC<IProps> = ({ open, setOpen, setReloadData }) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const [response, setResponse] = useState<IImportStudentFromSpreadSheetsResponse>()
  const handleOk = async () => {
    setConfirmLoading(true)
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      const res = await importStudent(data)
      if (!isEmpty(res)) {
        toast.success('Import thành công')
        setResponse(res)
        setReloadData()
      }
    } catch (error) {
      setConfirmLoading(false)
    }
    setConfirmLoading(false)
  }
  const handleCancel = () => {
    setOpen(false)
  }

  const handleNewImport = () => {
    setResponse(undefined)
  }

  useEffect(() => {
    form.setFieldsValue({ sheet_name: 'main', url: 'https://docs.google.com/spreadsheets/d/' })
  }, [response])

  return (
    <Modal
      title={'Import'}
      open={open}
      onOk={response ? handleNewImport : handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      cancelText={response ? 'Đóng' : 'Hủy'}
      okText={response ? 'Import mới' : 'Import'}
      maskClosable={false}
    >
      {response ? (
        <div className='flex flex-col gap-2'>
          <Card>
            <span className='mr-2 text-base font-medium'>Số học viên đã nhập: {size(response.inserted_ids)}</span>
          </Card>
          <Card>
            <p className='mr-2 text-base font-medium'>Số trường lỗi: {size(response.errors)}</p>
            {size(response.errors) > 0
              ? response.errors.map((item) => (
                  <div key={item.row}>
                    <span className='mr-2 font-medium'>Hàng {item.row}:</span>
                    <span style={{ whiteSpace: 'pre-line' }}>{item.detail}</span>
                  </div>
                ))
              : null}
          </Card>
        </div>
      ) : (
        <FormImport form={form} />
      )}
    </Modal>
  )
}

export default ModalImport
