import { userInfoState } from '@atom/authAtom'
import { OPTIONS_DOCUMENT_LABEL, OPTIONS_DOCUMENT_TYPE } from '@constants/document'
import { OPTIONS_ROLE } from '@constants/index'
import { EAdminRoleDetail } from '@domain/admin/type'
import { IDocumentInResponse } from '@domain/document'
import { isSuperAdmin } from '@src/utils'
import { Button, Form, Input, Modal, Select, Upload } from 'antd'
import { isObject } from 'lodash'
import React, { FC, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import type { UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdateDocument } from '@src/apis/document/useMutationDocument'

interface IProps {
  open: IDocumentInResponse
  setOpen: React.Dispatch<React.SetStateAction<IDocumentInResponse | undefined>>
}

const ModalUpdate: FC<IProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm()
  const userInfo = useRecoilValue(userInfoState)
  const [fileSelected, setFileSelected] = useState<File>()
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListDocuments'] })
    toast.success('Sửa thành công')
    setOpen(undefined)
  }

  const { mutate, isPending } = useUpdateDocument(onSuccess)

  const handleOk = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      delete data.file
      mutate({
        id: open.id,
        data: { file: fileSelected as File, payload: data },
      })
    } catch {
      /* empty */
    }
  }

  const handleCancel = () => {
    setOpen(undefined)
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
  }, [])

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
    <Modal title={'Sửa'} open={!!open} onOk={handleOk} confirmLoading={isPending} onCancel={handleCancel} cancelText='Hủy' okText={'Sửa'}>
      <Form layout='vertical' form={form} name='form-update-doc' initialValues={open}>
        <Form.Item name='name' label='Tên'>
          <Input placeholder='Tên tài liệu' />
        </Form.Item>
        <Form.Item name='type' label='Loại'>
          <Select placeholder='Chọn loại tài liệu' options={OPTIONS_DOCUMENT_TYPE} />
        </Form.Item>
        <Form.Item label='Mô tả' name='description'>
          <Input.TextArea rows={3} placeholder='Nhập mô tả' />
        </Form.Item>
        <Form.Item name='role' label='Quản lý'>
          <Select
            placeholder='Chọn ban'
            options={optionsRole}
            showSearch
            filterOption={(input, option) =>
              isObject(option) && (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
            }
          />
        </Form.Item>
        <Form.Item name='label' label='Nhãn tài liệu'>
          <Select
            filterOption={(input, option) =>
              isObject(option) && (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
            }
            placeholder='Chọn nhãn tài liệu'
            options={OPTIONS_DOCUMENT_LABEL}
            mode='multiple'
            allowClear
          />
        </Form.Item>
        {!(open?.mimeType && ['application/vnd.google-apps.document', 'application/vnd.google-apps.spreadsheet'].includes(open.mimeType)) && (
          <Form.Item name='file' label='Sửa file'>
            <Upload maxCount={1} {...props}>
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default ModalUpdate
