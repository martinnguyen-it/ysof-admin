import { userInfoState } from '@atom/authAtom'
import { OPTIONS_DOCUMENT_LABEL, OPTIONS_DOCUMENT_TYPE, OPTIONS_GOOGLE_FILE_TYPE, OPTIONS_MODE_FILE } from '@constants/document'
import { OPTIONS_ROLE } from '@constants/index'
import { EAdminRoleDetail } from '@domain/admin/type'
import { IDocumentInResponse } from '@domain/document'
import { createDocumentGoogle, createDocumentWithFile } from '@src/services/document'
import { isSuperAdmin } from '@src/utils'
import { Button, Form, Input, Modal, Select, Upload } from 'antd'
import { isEmpty } from 'lodash'
import React, { FC, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import type { UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

interface IProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setReloadData: React.DispatchWithoutAction
}

const ModalAdd: FC<IProps> = ({ open, setOpen, setReloadData }) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const userInfo = useRecoilValue(userInfoState)
  const [fileSelected, setFileSelected] = useState<File>()

  const handleOk = async () => {
    setConfirmLoading(true)
    let res: IDocumentInResponse
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      if (data.mode === 'file') {
        delete data.mode
        delete data.file
        res = await createDocumentWithFile({ file: fileSelected as File, payload: data })
        if (!isEmpty(res)) {
          toast.success('Thêm thành công')
          setOpen(false)
          setReloadData()
        }
      } else {
        delete data.mode
        res = await createDocumentGoogle(data)
        if (!isEmpty(res)) {
          toast.success('Thêm thành công')
          setOpen(false)
          setReloadData()
        }
      }
    } catch (error) {
      setConfirmLoading(false)
    }

    setConfirmLoading(false)
  }

  const handleCancel = () => {
    setOpen(false)
    setFileSelected(undefined)
  }

  const optionsRole = useMemo(() => {
    if (isSuperAdmin()) return OPTIONS_ROLE
    return (
      (userInfo &&
        userInfo.roles.map((val) => ({
          value: val,
          label: EAdminRoleDetail[val],
        }))) ||
      []
    )
  }, [userInfo])

  const mode = Form.useWatch('mode', form)

  const props: UploadProps = {
    onRemove: () => {
      setFileSelected(undefined)
    },
    beforeUpload: (file) => {
      setFileSelected(file)
      return false
    },
  }

  return (
    <Modal title={'Thêm'} open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel} cancelText='Hủy' okText={'Thêm'}>
      <Form
        layout='vertical'
        form={form}
        name='form-season'
        initialValues={{
          role: optionsRole[0].value,
          mode: OPTIONS_MODE_FILE[0].value,
        }}
      >
        <Form.Item
          name='name'
          label='Tên'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp tên tên',
            },
          ]}
        >
          <Input placeholder='Tên tài liệu' />
        </Form.Item>
        <Form.Item
          name='type'
          label='Loại'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn loại tài liệu',
            },
          ]}
        >
          <Select placeholder='Chọn loại tài liệu' options={OPTIONS_DOCUMENT_TYPE} />
        </Form.Item>
        <Form.Item label='Mô tả' name='description'>
          <Input.TextArea rows={3} placeholder='Nhập mô tả' />
        </Form.Item>
        <Form.Item
          name='role'
          label='Quản lý'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn ban',
            },
          ]}
        >
          <Select placeholder='Chọn ban' options={optionsRole} />
        </Form.Item>
        <Form.Item name='label' label='Nhãn tài liệu'>
          <Select placeholder='Chọn nhãn tài liệu' options={OPTIONS_DOCUMENT_LABEL} mode='multiple' allowClear />
        </Form.Item>
        <Form.Item
          name='mode'
          label='Phương thức'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn phương thức',
            },
          ]}
        >
          <Select placeholder='Chọn phương thức' options={OPTIONS_MODE_FILE} />
        </Form.Item>
        {mode === 'google' ? (
          <Form.Item
            name='google_type_file'
            label='Kiểu file google'
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn',
              },
            ]}
          >
            <Select placeholder='Chọn kiểu file google' options={OPTIONS_GOOGLE_FILE_TYPE} />
          </Form.Item>
        ) : (
          <Form.Item
            name='file'
            label='Chọn file'
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn file',
              },
            ]}
          >
            <Upload maxCount={1} {...props}>
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default ModalAdd
