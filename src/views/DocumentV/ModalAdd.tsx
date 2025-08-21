import React, { FC, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useCreateDocumentGoogle,
  useCreateDocumentWithFile,
} from '@/apis/document/useMutationDocument'
import { userInfoState } from '@/atom/authAtom'
import { EAdminRoleDetail } from '@/domain/admin/type'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, Form, Input, Modal, Select, Upload } from 'antd'
import { isObject } from 'lodash'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import { isSuperAdmin } from '@/lib/utils'
import {
  OPTIONS_DOCUMENT_LABEL,
  OPTIONS_DOCUMENT_TYPE,
  OPTIONS_GOOGLE_FILE_TYPE,
  OPTIONS_MODE_FILE,
} from '@/constants/document'
import { OPTIONS_ROLE } from '@/constants/index'

interface IProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalAdd: FC<IProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm()
  const userInfo = useRecoilValue(userInfoState)
  const [fileSelected, setFileSelected] = useState<File>()
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListDocuments'] })
    toast.success('Thêm thành công')
    setOpen(false)
  }

  const { mutate: mutateCreateFile, isPending: isPendingCreateWithFile } =
    useCreateDocumentWithFile(onSuccess)
  const { mutate: mutateCreateGoogle, isPending: isPendingCreateWithGoogle } =
    useCreateDocumentGoogle(onSuccess)

  const handleOk = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      if (data.mode === 'file') {
        delete data.mode
        delete data.file
        mutateCreateFile({ file: fileSelected as File, payload: data })
      } else {
        delete data.mode
        mutateCreateGoogle(data)
      }
    } catch {
      /* empty */
    }
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
    <Modal
      title={'Thêm'}
      open={open}
      onOk={handleOk}
      confirmLoading={isPendingCreateWithGoogle || isPendingCreateWithFile}
      onCancel={handleCancel}
      cancelText='Hủy'
      okText={'Thêm'}
      className='sm:!w-[70vw] lg:!w-[60vw]'
    >
      <Form
        layout='vertical'
        form={form}
        className='grid grid-cols-1 gap-x-3 sm:grid-cols-2'
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
              message: 'Vui lòng nhập tên tên',
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
          <Select
            placeholder='Chọn loại tài liệu'
            options={OPTIONS_DOCUMENT_TYPE}
          />
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
          <Select
            showSearch
            filterOption={(input, option) =>
              isObject(option) &&
              (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
            }
            placeholder='Chọn ban'
            options={optionsRole}
          />
        </Form.Item>
        <Form.Item name='label' label='Nhãn tài liệu'>
          <Select
            placeholder='Chọn nhãn tài liệu'
            options={OPTIONS_DOCUMENT_LABEL}
            filterOption={(input, option) =>
              isObject(option) &&
              (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
            }
            mode='multiple'
            showSearch
            allowClear
          />
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
            <Select
              placeholder='Chọn kiểu file google'
              options={OPTIONS_GOOGLE_FILE_TYPE}
            />
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
        <Form.Item className='sm:col-span-2' label='Mô tả' name='description'>
          <Input.TextArea rows={3} placeholder='Nhập mô tả' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAdd
